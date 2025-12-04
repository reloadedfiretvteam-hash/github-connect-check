import { useState, useEffect, useCallback, ImgHTMLAttributes } from 'react';

interface ValidatedImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'onError'> {
  src: string;
  fallbackSrc: string;
  minBytes?: number;
  alt: string;
  onValidationFail?: (reason: string) => void;
}

export default function ValidatedImage({
  src,
  fallbackSrc,
  minBytes = 1000,
  alt,
  onValidationFail,
  className,
  ...imgProps
}: ValidatedImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>(fallbackSrc);
  const [isValidating, setIsValidating] = useState<boolean>(true);
  const [hasFailed, setHasFailed] = useState<boolean>(false);

  const validateViaHead = useCallback(async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD', mode: 'cors' });
      if (!response.ok) return false;
      
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength, 10) < minBytes) {
        return false;
      }
      return true;
    } catch {
      return true; // CORS blocked, proceed to image validation
    }
  }, [minBytes]);

  const validateViaImage = useCallback((url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve(img.naturalWidth > 0 && img.naturalHeight > 0);
      };
      img.onerror = () => resolve(false);
      img.src = url;
    });
  }, []);

  useEffect(() => {
    let mounted = true;

    const validateImage = async () => {
      if (!src || src === fallbackSrc) {
        setCurrentSrc(fallbackSrc);
        setIsValidating(false);
        return;
      }

      setIsValidating(true);

      const headValid = await validateViaHead(src);
      if (!mounted) return;

      if (!headValid) {
        setCurrentSrc(fallbackSrc);
        setHasFailed(true);
        setIsValidating(false);
        onValidationFail?.('HEAD validation failed');
        return;
      }

      const imageValid = await validateViaImage(src);
      if (!mounted) return;

      if (imageValid) {
        setCurrentSrc(src);
      } else {
        setCurrentSrc(fallbackSrc);
        setHasFailed(true);
        onValidationFail?.('Image validation failed');
      }
      setIsValidating(false);
    };

    validateImage();

    return () => {
      mounted = false;
    };
  }, [src, fallbackSrc, validateViaHead, validateViaImage, onValidationFail]);

  const handleError = () => {
    if (!hasFailed && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasFailed(true);
      onValidationFail?.('Runtime load error');
    }
  };

  return (
    <img
      {...imgProps}
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
}
