import { DiigoBookmark, DiigoHighlight, ReadwiseHighlight } from './types';

// eslint-disable-next-line max-len
export const convertDiigoHighlightToReadwise = (diigoHighlight: DiigoHighlight, diigoBookmark: DiigoBookmark): ReadwiseHighlight => {
  const highlight: ReadwiseHighlight = {
    text: diigoHighlight.content,
    title: diigoBookmark.title,
    source_url: diigoBookmark.url,
    highlighted_at: diigoHighlight.created_at,
  }
  if (diigoHighlight.comments.length)
    highlight.note = diigoHighlight.comments.map((comment) => comment.content).join(' ');
  return highlight
};
