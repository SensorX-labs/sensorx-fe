import { KeysetPagedResult, Result } from "@/shared/models/base-response";

export interface CursorPagedResult<T> extends KeysetPagedResult<T> {}

export type CursorPagedListResult<T> = Result<CursorPagedResult<T>>;
