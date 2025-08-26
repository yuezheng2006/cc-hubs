/**
 * 健康检查API端点
 * 用于监控应用程序状态和系统健康度
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * 检查文件系统状态
 * @returns {Promise<Object>} 文件系统检查结果
 */
async function checkFileSystem() {
  try {
    const docsPath = path.join(process.cwd(), 'docs');
    const stats = await fs.stat(docsPath);
    const files = await fs.readdir(docsPath);
    
    return {
      status: 'healthy',
      docsDirectory: {
        exists: true,
        isDirectory: stats.isDirectory(),
        fileCount: files.length,
        lastModified: stats.mtime
      }
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    };
  }
}

/**
 * 检查配置文件状态
 * @returns {Promise<Object>} 配置文件检查结果
 */
async function checkConfiguration() {
  try {
    const mintConfigPath = path.join(process.cwd(), 'mint.json');
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    
    const [mintConfig, packageJson] = await Promise.all([
      fs.readFile(mintConfigPath, 'utf8').then(JSON.parse),
      fs.readFile(packageJsonPath, 'utf8').then(JSON.parse)
    ]);
    
    return {
      status: 'healthy',
      configuration: {
        mintConfig: {
          exists: true,
          name: mintConfig.name,
          version: mintConfig.version
        },
        packageJson: {
          exists: true,
          name: packageJson.name,
          version: packageJson.version
        }
      }
    };
  } catch (error) {
    return {
      status: 'error',
      error: error.message
    };
  }
}

/**
 * 获取系统信息
 * @returns {Object} 系统信息
 */
function getSystemInfo() {
  return {
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch,
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      external: Math.round(process.memoryUsage().external / 1024 / 1024)
    },
    env: process.env.NODE_ENV || 'development'
  };
}

/**
 * 主要的健康检查处理函数
 * @param {Object} req - 请求对象
 * @param {Object} res - 响应对象
 */
export default async function handler(req, res) {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // 处理OPTIONS请求
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  // 只允许GET请求
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  
  try {
    const startTime = Date.now();
    
    // 并行执行所有检查
    const [fileSystemCheck, configCheck] = await Promise.all([
      checkFileSystem(),
      checkConfiguration()
    ]);
    
    const systemInfo = getSystemInfo();
    const responseTime = Date.now() - startTime;
    
    // 确定整体健康状态
    const overallStatus = (
      fileSystemCheck.status === 'healthy' && 
      configCheck.status === 'healthy'
    ) ? 'healthy' : 'degraded';
    
    const healthData = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      version: '1.0.0',
      checks: {
        fileSystem: fileSystemCheck,
        configuration: configCheck
      },
      system: systemInfo
    };
    
    // 根据健康状态设置HTTP状态码
    const statusCode = overallStatus === 'healthy' ? 200 : 503;
    
    res.status(statusCode).json(healthData);
    
  } catch (error) {
    console.error('Health check error:', error);
    
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      error: 'Internal server error during health check',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}