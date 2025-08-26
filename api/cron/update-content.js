/**
 * 内容更新定时任务API端点
 * 用于定期爬取和更新文档内容
 */

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const util = require('util');

const execAsync = util.promisify(exec);

/**
 * 执行爬虫脚本
 * @param {string} scriptPath - 爬虫脚本路径
 * @returns {Promise<Object>} 执行结果
 */
async function runCrawler(scriptPath) {
  try {
    const { stdout, stderr } = await execAsync(`node ${scriptPath}`, {
      cwd: process.cwd(),
      timeout: 300000, // 5分钟超时
      maxBuffer: 1024 * 1024 * 10 // 10MB缓冲区
    });
    
    return {
      success: true,
      output: stdout,
      error: stderr || null
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      output: error.stdout || null
    };
  }
}

/**
 * 运行内容处理工具
 * @returns {Promise<Object>} 处理结果
 */
async function processContent() {
  try {
    const contentManagerPath = path.join(process.cwd(), 'scripts/content-manager.js');
    
    // 生成索引
    const indexResult = await execAsync(`node ${contentManagerPath} generate-index`, {
      cwd: process.cwd(),
      timeout: 60000
    });
    
    // 验证文档
    const validateResult = await execAsync(`node ${contentManagerPath} validate`, {
      cwd: process.cwd(),
      timeout: 120000
    });
    
    return {
      success: true,
      indexGeneration: indexResult.stdout,
      validation: validateResult.stdout
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 检查内容变更
 * @returns {Promise<Object>} 变更检查结果
 */
async function checkContentChanges() {
  try {
    const { stdout } = await execAsync('git status --porcelain docs/', {
      cwd: process.cwd()
    });
    
    const changes = stdout.trim().split('\n').filter(line => line.length > 0);
    
    return {
      hasChanges: changes.length > 0,
      changedFiles: changes.map(line => {
        const status = line.substring(0, 2);
        const file = line.substring(3);
        return { status, file };
      })
    };
  } catch (error) {
    return {
      hasChanges: false,
      error: error.message
    };
  }
}

/**
 * 提交内容变更
 * @param {Array} changedFiles - 变更的文件列表
 * @returns {Promise<Object>} 提交结果
 */
async function commitChanges(changedFiles) {
  try {
    // 添加变更的文件
    await execAsync('git add docs/', { cwd: process.cwd() });
    
    // 创建提交信息
    const timestamp = new Date().toISOString();
    const fileCount = changedFiles.length;
    const commitMessage = `chore: auto-update content (${fileCount} files) - ${timestamp}`;
    
    // 提交变更
    const { stdout } = await execAsync(`git commit -m "${commitMessage}"`, {
      cwd: process.cwd()
    });
    
    return {
      success: true,
      commitHash: stdout.match(/\[\w+\s+(\w+)\]/)?.[1] || 'unknown',
      message: commitMessage
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * 发送通知
 * @param {Object} updateResult - 更新结果
 * @returns {Promise<void>}
 */
async function sendNotification(updateResult) {
  // 这里可以集成Slack、Discord、邮件等通知服务
  // 目前只记录日志
  console.log('Content update notification:', {
    timestamp: new Date().toISOString(),
    success: updateResult.success,
    summary: updateResult.summary
  });
}

/**
 * 主要的内容更新处理函数
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
export default async function handler(req, res) {
  // 验证请求来源（Vercel Cron或授权请求）
  const authHeader = req.headers.authorization;
  const cronSecret = process.env.CRON_SECRET;
  
  if (req.headers['user-agent'] !== 'vercel-cron/1.0' && 
      (!authHeader || authHeader !== `Bearer ${cronSecret}`)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  
  // 只允许POST请求
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  const startTime = Date.now();
  const updateLog = {
    timestamp: new Date().toISOString(),
    steps: []
  };
  
  try {
    // 步骤1: 运行ctok.ai爬虫
    updateLog.steps.push({ step: 'ctok-crawler', status: 'running', startTime: Date.now() });
    const ctokResult = await runCrawler('scripts/crawlers/ctok-crawler.js');
    updateLog.steps[updateLog.steps.length - 1] = {
      ...updateLog.steps[updateLog.steps.length - 1],
      status: ctokResult.success ? 'completed' : 'failed',
      endTime: Date.now(),
      result: ctokResult
    };
    
    // 步骤2: 运行cookbook爬虫
    updateLog.steps.push({ step: 'cookbook-crawler', status: 'running', startTime: Date.now() });
    const cookbookResult = await runCrawler('scripts/crawlers/cookbook-crawler.js');
    updateLog.steps[updateLog.steps.length - 1] = {
      ...updateLog.steps[updateLog.steps.length - 1],
      status: cookbookResult.success ? 'completed' : 'failed',
      endTime: Date.now(),
      result: cookbookResult
    };
    
    // 步骤3: 处理内容
    updateLog.steps.push({ step: 'content-processing', status: 'running', startTime: Date.now() });
    const processResult = await processContent();
    updateLog.steps[updateLog.steps.length - 1] = {
      ...updateLog.steps[updateLog.steps.length - 1],
      status: processResult.success ? 'completed' : 'failed',
      endTime: Date.now(),
      result: processResult
    };
    
    // 步骤4: 检查变更
    updateLog.steps.push({ step: 'change-detection', status: 'running', startTime: Date.now() });
    const changeResult = await checkContentChanges();
    updateLog.steps[updateLog.steps.length - 1] = {
      ...updateLog.steps[updateLog.steps.length - 1],
      status: 'completed',
      endTime: Date.now(),
      result: changeResult
    };
    
    // 步骤5: 提交变更（如果有）
    let commitResult = null;
    if (changeResult.hasChanges) {
      updateLog.steps.push({ step: 'commit-changes', status: 'running', startTime: Date.now() });
      commitResult = await commitChanges(changeResult.changedFiles);
      updateLog.steps[updateLog.steps.length - 1] = {
        ...updateLog.steps[updateLog.steps.length - 1],
        status: commitResult.success ? 'completed' : 'failed',
        endTime: Date.now(),
        result: commitResult
      };
    }
    
    const totalTime = Date.now() - startTime;
    const successfulSteps = updateLog.steps.filter(step => step.status === 'completed').length;
    const totalSteps = updateLog.steps.length;
    
    const finalResult = {
      success: successfulSteps === totalSteps,
      duration: `${totalTime}ms`,
      summary: {
        crawlers: {
          ctok: ctokResult.success,
          cookbook: cookbookResult.success
        },
        processing: processResult.success,
        changes: {
          detected: changeResult.hasChanges,
          committed: commitResult?.success || false,
          fileCount: changeResult.changedFiles?.length || 0
        }
      },
      log: updateLog
    };
    
    // 发送通知
    await sendNotification(finalResult);
    
    res.status(200).json(finalResult);
    
  } catch (error) {
    console.error('Content update error:', error);
    
    const errorResult = {
      success: false,
      error: error.message,
      duration: `${Date.now() - startTime}ms`,
      log: updateLog
    };
    
    await sendNotification(errorResult);
    
    res.status(500).json(errorResult);
  }
}