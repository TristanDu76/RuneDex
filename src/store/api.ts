import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    endpoints: (builder) => ({
        getRegionShard: builder.query<any[], string>({
            query: (regionId) => `data/shards/${regionId}`,
        }),
    }),
});

export const { useGetRegionShardQuery } = api;
