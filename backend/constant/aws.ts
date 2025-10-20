const isProd = process.env.NODE_ENV === "production";

export const quotation_bucket_name = isProd
  ? process.env.QUOTE_PROD_BUCKET_NAME
  : process.env.QUOTE_LOCAL_BUCKET_NAME;

export const order_bucket_name = isProd
  ? process.env.ORDER_PROD_BUCKET_NAME
  : process.env.ORDER_LOCAL_BUCKET_NAME;
