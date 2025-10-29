const removeSlashUrl = (url: string = ""): string => {
  if (url.endsWith('/')) {
    // The slice method is often cleaner than substring for this
    return url.slice(0, -1); 
  }
  return url;
};

export {removeSlashUrl}