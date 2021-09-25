/* eslint-disable camelcase */
export interface DiigoHighlight {
  content: string,
  comments: [
    {
      content: string,
      user: string,
      created_at: string,
    },
  ],
  user: string,
  created_at: string,
}

export interface DiigoBookmark {
  title: string,
  url: string,
  user: string,
  desc: string,
  tags: string,
  shared: string,
  created_at: string,
  updated_at: string,
  comments: [],
  annotations: DiigoHighlight[]
}

export interface ReadwiseHighlight {
  text: string;
  title?: string;
  author?: string;
  image_url?: string;
  source_url?: string;
  source_type?: string;
  note?: string;
  location?: string;
  location_type?: string;
  highlighted_at?: string;
  highlight_url?: string;
}
