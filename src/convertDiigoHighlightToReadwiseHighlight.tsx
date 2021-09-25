import { DiigoBookmark, DiigoHighlight, ReadwiseHighlight } from './types';

// eslint-disable-next-line max-len
export const convertDiigoHighlightToReadwise = (diigoHighlight: DiigoHighlight, diigoBookmark: DiigoBookmark): ReadwiseHighlight => ({
  text: diigoHighlight.content,
  title: diigoBookmark.title,
  source_url: diigoBookmark.url,
  note: diigoHighlight.comments.map((comment) => comment.content).join(' '),
  highlighted_at: diigoHighlight.created_at,
});
