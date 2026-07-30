import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RegionShardEntry } from '@/types/map';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/api/' }),
    endpoints: (builder) => ({
        getRegionShard: builder.query<RegionShardEntry[], string>({
            query: (regionId) => `data/shards/${regionId}`,
        }),
    }),
});

export const { useGetRegionShardQuery } = api;
