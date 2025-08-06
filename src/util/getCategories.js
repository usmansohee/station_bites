import useSWR from "swr";

const getCategories = (initialData) => {
    let res;
    if (initialData) {
        res = useSWR("/api/categories", { initialData });
    } else {
        res = useSWR("/api/categories");
    }
    
    // Return initialData if SWR data is not yet available and we have initial data
    const categories = res.data || initialData || [];
    
    return {
        categories: Array.isArray(categories) ? categories : [],
        isLoading: !res.error && !res.data && !initialData,
        error: res.error,
    };
};

export default getCategories;
