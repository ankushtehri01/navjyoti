import Modal from './Modal.jsx';
import Button from './Button.jsx';

/**
 * Confirmation dialog for destructive/irreversible actions.
 */
const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  description = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  loading = false,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title={title}
    size="sm"
    footer={
      <>
        <Button variant="ghost" onClick={onClose} disabled={loading}>
          {cancelLabel}
        </Button>
        <Button variant={variant} onClick={onConfirm} isLoading={loading}>
          {confirmLabel}
        </Button>
      </>
    }
  >
    <p className="text-slate-400">{description}</p>
  </Modal>
);

export default ConfirmDialog;
