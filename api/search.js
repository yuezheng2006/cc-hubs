/**
 * 搜索API端点
 * 提供文档内容的全文搜索功能
 */

const fs = require('fs').promises;
const path = require('path');

/**
 * 搜索索引缓存
 */
let searchIndex = null;
let indexLastUpdated = null;

/**
 * 加载搜索索引
 * @returns {Promise<Object>} 搜索索引数据
 */
async function loadSearchIndex() {
  try {
    const indexPath = path.join(process.cwd(), 'docs/.index/search-index.json');
    const stats = await fs.stat(indexPath);
    
    // 检查缓存是否需要更新
    if (!searchIndex || !indexLastUpdated || stats.mtime > indexLastUpdated) {
      const indexData = await fs.readFile(indexPath, 'utf8');
      searchIndex = JSON.parse(indexData);
      indexLastUpdated = stats.mtime;
    }
    
    return searchIndex;
  } catch (error) {
    console.error('Failed to load search index:', error);
    return { documents: [], tags: [], categories: [] };
  }
}

/**
 * 计算文本相似度分数
 * @param {string} text - 文本内容
 * @param {string} query - 搜索查询
 * @returns {number} 相似度分数 (0-1)
 */
function calculateRelevanceScore(text, query) {
  const normalizedText = text.toLowerCase();
  const normalizedQuery = query.toLowerCase();
  const queryTerms = normalizedQuery.split(/\s+/).filter(term => term.length > 0);
  
  let score = 0;
  let totalTerms = queryTerms.length;
  
  queryTerms.forEach(term => {
    // 精确匹配得分更高
    if (normalizedText.includes(term)) {
      score += 1;
      
      // 标题匹配额外加分
      if (text.toLowerCase().includes(term)) {
        score += 0.5;
      }
      
      // 开头匹配额外加分
      if (normalizedText.startsWith(term)) {
        score += 0.3;
      }
    }
    
    // 模糊匹配
    const fuzzyMatches = normalizedText.match(new RegExp(term.split('').join('.*'), 'g'));
    if (fuzzyMatches) {
      score += fuzzyMatches.length * 0.2;
    }
  });
  
  return Math.min(score / totalTerms, 1);
}

/**
 * 搜索文档
 * @param {Object} index - 搜索索引
 * @param {string} query - 搜索查询
 * @param {Object} filters - 搜索过滤器
 * @returns {Array} 搜索结果
 */
function searchDocuments(index, query, filters = {}) {
  if (!query || query.trim().length === 0) {
    return [];
  }
  
  const results = [];
  const { category, tag, type } = filters;
  
  index.documents.forEach(doc => {
    // 应用过滤器
    if (category && doc.category !== category) return;
    if (tag && !doc.tags.includes(tag)) return;
    if (type && doc.type !== type) return;
    
    // 计算相关性分数
    let relevanceScore = 0;
    
    // 标题匹配
    const titleScore = calculateRelevanceScore(doc.title, query) * 3;
    
    // 描述匹配
    const descriptionScore = calculateRelevanceScore(doc.description || '', query) * 2;
    
    // 内容匹配
    const contentScore = calculateRelevanceScore(doc.content || '', query);
    
    // 标签匹配
    const tagScore = doc.tags.some(tag => 
      calculateRelevanceScore(tag, query) > 0.5
    ) ? 1 : 0;
    
    relevanceScore = titleScore + descriptionScore + contentScore + tagScore;
    
    if (relevanceScore > 0) {
      // 生成搜索片段
      const snippet = generateSearchSnippet(doc.content || doc.description || '', query);
      
      results.push({
        ...doc,
        relevanceScore,
        snippet,
        matchedFields: {
          title: titleScore > 0,
          description: descriptionScore > 0,
          content: contentScore > 0,
          tags: tagScore > 0
        }
      });
    }
  });
  
  // 按相关性排序
  return results.sort((a, b) => b.relevanceScore - a.relevanceScore);
}

/**
 * 生成搜索结果片段
 * @param {string} content - 文档内容
 * @param {string} query - 搜索查询
 * @returns {string} 搜索片段
 */
function generateSearchSnippet(content, query) {
  const maxLength = 200;
  const queryTerms = query.toLowerCase().split(/\s+/);
  
  // 查找第一个匹配的位置
  let matchIndex = -1;
  for (const term of queryTerms) {
    const index = content.toLowerCase().indexOf(term);
    if (index !== -1) {
      matchIndex = index;
      break;
    }
  }
  
  if (matchIndex === -1) {
    return content.substring(0, maxLength) + (content.length > maxLength ? '...' : '');
  }
  
  // 计算片段起始位置
  const start = Math.max(0, matchIndex - 50);
  const end = Math.min(content.length, start + maxLength);
  
  let snippet = content.substring(start, end);
  
  // 添加省略号
  if (start > 0) snippet = '...' + snippet;
  if (end < content.length) snippet = snippet + '...';
  
  // 高亮匹配的词汇
  queryTerms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    snippet = snippet.replace(regex, '<mark>$1</mark>');
  });
  
  return snippet;
}

/**
 * 获取搜索建议
 * @param {Object} index - 搜索索引
 * @param {string} query - 搜索查询
 * @returns {Array} 搜索建议
 */
function getSearchSuggestions(index, query) {
  if (!query || query.length < 2) {
    return [];
  }
  
  const suggestions = new Set();
  const normalizedQuery = query.toLowerCase();
  
  // 从标题中提取建议
  index.documents.forEach(doc => {
    const title = doc.title.toLowerCase();
    if (title.includes(normalizedQuery)) {
      suggestions.add(doc.title);
    }
    
    // 从标签中提取建议
    doc.tags.forEach(tag => {
      if (tag.toLowerCase().includes(normalizedQuery)) {
        suggestions.add(tag);
      }
    });
  });
  
  return Array.from(suggestions).slice(0, 10);
}

/**
 * 主要的搜索处理函数
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
    const { q: query, category, tag, type, suggestions } = req.query;
    
    // 加载搜索索引
    const index = await loadSearchIndex();
    
    // 如果请求搜索建议
    if (suggestions === 'true') {
      const suggestionList = getSearchSuggestions(index, query || '');
      res.status(200).json({
        suggestions: suggestionList,
        query: query || ''
      });
      return;
    }
    
    // 验证查询参数
    if (!query || query.trim().length === 0) {
      res.status(400).json({ 
        error: 'Query parameter is required',
        availableFilters: {
          categories: [...new Set(index.documents.map(doc => doc.category))],
          tags: [...new Set(index.documents.flatMap(doc => doc.tags))],
          types: [...new Set(index.documents.map(doc => doc.type))]
        }
      });
      return;
    }
    
    const startTime = Date.now();
    
    // 执行搜索
    const results = searchDocuments(index, query, { category, tag, type });
    
    const searchTime = Date.now() - startTime;
    
    // 分页处理
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedResults = results.slice(startIndex, endIndex);
    
    res.status(200).json({
      query,
      results: paginatedResults,
      pagination: {
        page,
        limit,
        total: results.length,
        pages: Math.ceil(results.length / limit),
        hasNext: endIndex < results.length,
        hasPrev: page > 1
      },
      filters: {
        category,
        tag,
        type
      },
      meta: {
        searchTime: `${searchTime}ms`,
        totalResults: results.length,
        indexLastUpdated: indexLastUpdated?.toISOString()
      }
    });
    
  } catch (error) {
    console.error('Search error:', error);
    
    res.status(500).json({
      error: 'Internal server error during search',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}