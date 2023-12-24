export enum ChatChunkType {
  TEXT = 0,
  IMG = 1,
  MENTION = 2,
}

export interface ChatChunk {
  type: ChatChunkType;
  content: string;
}

export interface ChatMessage {
  chunks: ChatChunk[];
  textChunkCount: number;
  imgChunkCount: number;
}
