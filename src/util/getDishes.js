import useSWR from "swr";

const getDishes = (initialData) => {
    let res;
    if (initialData) {
        res = useSWR("/api/dishes", { initialData });
    } else {
        res = useSWR("/api/dishes");
    }
    
    // Return initialData if SWR data is not yet available and we have initial data
    const dishes = res.data || initialData || [];
    
    return {
        dishes: Array.isArray(dishes) ? dishes : [],
        isLoading: !res.error && !res.data && !initialData,
        error: res.error,
    };
};

export default getDishes;
