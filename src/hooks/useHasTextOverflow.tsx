import { useState, useEffect } from 'react';

function useHasTextOverflow(
  folderTextRef: React.RefObject<HTMLParagraphElement>,
  folderTitle: string
) {
  const [isTextOverflow, setIsTextOverflow] = useState(false);

  useEffect(() => {
    if (!folderTextRef.current) return;

    const elementCopy = document.createElement('p');
    elementCopy.style.position = 'absolute';
    elementCopy.style.fontSize = '12px';
    elementCopy.className = 'folder-title-copy';
    elementCopy.innerText = folderTitle;
    document.body.appendChild(elementCopy);

    if (folderTextRef.current) {
      setIsTextOverflow(folderTextRef.current?.offsetWidth < elementCopy.scrollWidth);
      document.querySelectorAll('.folder-title-copy').forEach((el) => el.remove());
    }

    return () => {
      document.querySelectorAll('.folder-title-copy').forEach((el) => el.remove());
    };
  }, [folderTitle]);

  return isTextOverflow;
}

export default useHasTextOverflow;
