import React from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { clearSelectedItems } from '../store/slices/selectedItemsSlice';
import styles from './SelectedItemsFlyout.module.css';

interface SelectedItemsFlyoutProps {
  onDownload: () => void;
}

const SelectedItemsFlyout: React.FC<SelectedItemsFlyoutProps> = ({
  onDownload,
}) => {
  const dispatch = useAppDispatch();
  const selectedItems = useAppSelector((state) => state.selectedItems.items);
  const selectedCount = selectedItems.length;

  if (selectedCount === 0) {
    return null;
  }

  const handleUnselectAll = () => {
    dispatch(clearSelectedItems());
  };

  return (
    <div className={styles.flyout}>
      <div className={styles.content}>
        <div className={styles.info}>
          <span className={styles.count}>
            {selectedCount} item{selectedCount === 1 ? '' : 's'} selected
          </span>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.unselectButton}
            onClick={handleUnselectAll}
            type="button"
          >
            Unselect all
          </button>
          <button
            className={styles.downloadButton}
            onClick={onDownload}
            type="button"
          >
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectedItemsFlyout;
