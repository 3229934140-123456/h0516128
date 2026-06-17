export const formatCurrency = (amount: number, symbol: string = '¥'): string => {
  return `${symbol}${amount.toLocaleString('zh-CN')}`;
};

export const formatWan = (amount: number): string => {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(1)}万`;
  }
  return amount.toLocaleString('zh-CN');
};

export const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export const formatPercent = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

export const maskPhone = (phone: string): string => {
  if (!phone || phone.length < 11) return phone;
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2');
};

export const maskIdCard = (idCard: string): string => {
  if (!idCard || idCard.length < 15) return idCard;
  if (idCard.length === 15) {
    return idCard.replace(/(\d{6})\d{6}(\d{3})/, '$1******$2');
  }
  return idCard.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2');
};

export const generateId = (prefix: string = ''): string => {
  return `${prefix}${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
};
