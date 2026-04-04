export enum QuoteResponseStatus {
    ACCEPT = 'ACCEPT', // khách chốt báo giá
    DECLINED = 'DECLINED', // khách từ chối báo giá
    REVISIONREQUIRED = 'REVISIONREQUIRED', // khách yêu cầu sửa báo giá
}