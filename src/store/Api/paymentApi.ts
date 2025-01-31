import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../utils/baseUrl";

interface IInvoice {
  cashier: string;
  course_name: string;
  created_at: string;
  deadline: string;
  final_price: number;
  invoice_id: string;
  last_name: string;
  name: string;
  remainder: number;
  student_card_id: number;
  sum: number;
  thread: string;
}
interface IGetInvoiceByIdResponse {
  data: IInvoice;
  message: string;
}
interface IPaymentUserLinkPayload{
  invoice_id:string
}
interface IPaymentUserLinkResponse{
  link:string
}

export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    getInvoiceById: builder.query<IGetInvoiceByIdResponse, string>({
      query: (invoiceId) => `payment/${invoiceId}`,
    }),
    paymentUserLink: builder.mutation<IPaymentUserLinkResponse,IPaymentUserLinkPayload>({
      query: (payload) => ({
        url: "/payme-link",
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useGetInvoiceByIdQuery,
  useLazyGetInvoiceByIdQuery,
  usePaymentUserLinkMutation,
} = paymentApi;
