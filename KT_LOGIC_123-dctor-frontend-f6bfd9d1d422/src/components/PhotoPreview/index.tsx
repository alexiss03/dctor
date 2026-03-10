"use client";

import { useState } from "react";
import { Button } from "../Button";

import ImageViewer from "react-simple-image-viewer";

import styles from "./style.module.css";

type PhotoPreviewProps = {
  url: string;
  width?: string;
  height?: string;
};

export function PhotoPreview({
  url,
  width = "100%",
  height = "100%",
}: PhotoPreviewProps) {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  url = `/test/${url}`;

  return (
    <>
      <Button
        className={styles.photo}
        variant="clear"
        style={{
          backgroundImage: `url(${url})`,
          width,
          height,
        }}
        onClick={() => setIsViewerOpen(true)}
      ></Button>
      {isViewerOpen && (
        <ImageViewer
          src={[url]}
          currentIndex={0}
          closeOnClickOutside={true}
          onClose={() => setIsViewerOpen(false)}
        />
      )}
    </>
  );
}
