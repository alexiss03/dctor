import { PhotoPreview } from "../PhotoPreview";

import styles from "./style.module.css";

type PhotoPreviewGroupProps = {
  urls: string[];
};

export function PhotoPreviewGroup({ urls }: PhotoPreviewGroupProps) {
  return (
    <div className={styles.container}>
      {urls.map((url, i) => (
        <div key={`${url}/${i}`} className={styles["photo-container"]}>
          <PhotoPreview url={url} />
        </div>
      ))}
    </div>
  );
}
