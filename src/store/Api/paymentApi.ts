// services/paymentApi.ts
import { createApi, fetchBaseQuery, BaseQueryFn } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../utils/baseUrl";
import { FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Типизация данных
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

export interface IGetInvoiceByIdResponse {
  data: IInvoice;
  message: string;
}

interface IPaymentUserLinkPayload {
  invoice_id: string;
}

interface IPaymentUserLinkResponse {
  link: string;
}

// Обработка ошибок
const baseQuery = fetchBaseQuery({ baseUrl });

const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const { status, data } = result.error;

    if (status === 400 && data) {
      console.error("Ошибка 400:", (data as IGetInvoiceByIdResponse).message);
      console.table((data as IGetInvoiceByIdResponse).data);
    }

    if (status === 403) {
      console.error("Ошибка 403: Доступ запрещён");
    }
  }

  return result;
};

// API с обработкой ошибок
export const paymentApi = createApi({
  reducerPath: "paymentApi",
  baseQuery: baseQueryWithErrorHandling,
  endpoints: (builder) => ({
    getInvoiceById: builder.query<IGetInvoiceByIdResponse, string>({
      query: (invoiceId) => `payment/${invoiceId}`,
    }),
    paymentUserLink: builder.mutation<IPaymentUserLinkResponse, IPaymentUserLinkPayload>({
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
