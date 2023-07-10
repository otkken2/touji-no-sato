import { useEffect, useRef } from "react";
const loadImage = require('blueimp-load-image');

const ImageWithOrientation = ({ imageUrl }:any) => {
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imgRef.current) {
      loadImage(
        imageUrl,
        function (img: any) {
          if (img.type === "error") {
            console.log("Error loading image");
          } else {
            if(!imgRef.current)return;
            imgRef.current.innerHTML = '';
            imgRef.current.appendChild(img);
          }
        },
        { orientation: true }
      );
    }
  }, [imageUrl]);

  return <div ref={imgRef} />;
};

export default ImageWithOrientation;