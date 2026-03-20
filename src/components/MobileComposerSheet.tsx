import type { ReviewItem } from "../types";

interface MobileComposerSheetProps {
  review: ReviewItem;
  draftResponse: string;
  draftStatus: "idle" | "editing" | "saved";
  onDraftResponseChange: (value: string) => void;
  onSaveDraft: () => void;
  onApproveAndSend: () => void;
  onClose: () => void;
}

export function MobileComposerSheet({
  review,
  draftResponse,
  draftStatus,
  onDraftResponseChange,
  onSaveDraft,
  onApproveAndSend,
  onClose,
}: MobileComposerSheetProps) {
  const draftStatusCopy =
    draftStatus === "saved"
      ? "Draft saved locally."
      : draftStatus === "editing"
        ? "Draft changes are ready to save."
        : "Edit the reply, then send publicly.";

  return (
    <div className="mobile-composer-layer" role="presentation">
      <button
        type="button"
        className="mobile-composer-backdrop"
        aria-label="Close reply editor"
        onClick={onClose}
      />

      <section
        className="mobile-composer-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-composer-title"
      >
        <div className="mobile-composer-header">
          <div>
            <span className="eyebrow-label">Reply composer</span>
            <h3 id="mobile-composer-title">Edit reply, then send publicly.</h3>
          </div>
          <button
            type="button"
            className="secondary-link-button"
            onClick={onClose}
          >
            Back to queue
          </button>
        </div>

        <div className="mobile-composer-body">
          <article className="mobile-composer-summary">
            <div className="mobile-composer-summary-top">
              <strong>{review.author}</strong>
              <span>
                {review.stars} star{review.stars === 1 ? "" : "s"} · {review.dateLabel}
              </span>
            </div>
            <p>{review.snippet}</p>
          </article>

          <div className="mobile-composer-note-row">
            <span className="eyebrow-label">Draft status</span>
            <p>{draftStatusCopy}</p>
          </div>

          <label className="mobile-composer-label" htmlFor="mobile-reply-draft">
            AI reply draft
          </label>
          <textarea
            id="mobile-reply-draft"
            value={draftResponse}
            onChange={(event) => onDraftResponseChange(event.target.value)}
            aria-label={`Edit response for ${review.author}`}
          />
        </div>

        <div className="mobile-composer-footer">
          <button type="button" className="action-button" onClick={onSaveDraft}>
            Save draft
          </button>
          <button
            type="button"
            className="action-button action-primary"
            onClick={onApproveAndSend}
          >
            Approve &amp; send
          </button>
        </div>
      </section>
    </div>
  );
}
