import { useQuery } from "react-query";

export default function useGetImage(path, fallbackPath) {
  const queryId = path;
  return useQuery(
    queryId,
    async () =>
      await new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(path);
        img.onerror = () => resolve(fallbackPath);

        img.src = path;
      }),
    {
      refetchOnWindowFocus: false,
      // placeholderData: loaderPath,
      staleTime: Infinity,
    },
  );
}
