import {
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryOptions,
    UseMutationOptions
} from '@tanstack/react-query';
import api from './api';

export function useApiQuery<T>(
    key: string[],
    url: string,
    options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
    return useQuery<T, Error>({
        queryKey: key,
        queryFn: async () => {
            const { data } = await api.get<T>(url);
            return data;
        },
        ...options,
    });
}

export function useApiMutation<TVariables, TData>(
    method: 'post' | 'put' | 'delete' | 'patch',
    baseUrl: string,
    options?: UseMutationOptions<TData, Error, TVariables>
) {
    const queryClient = useQueryClient();
    return useMutation<TData, Error, TVariables>({
        mutationFn: async (variables: any) => {
            // If delete, variables might be an ID to append to URL or not
            const url = method === 'delete' && typeof variables === 'number'
                ? `${baseUrl}/${variables}`
                : baseUrl;

            const { data } = await api[method]<TData>(url, variables);
            return data;
        },
        ...options,
    });
}
