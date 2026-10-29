async function apiFetch(url,options={},onUnauthorized)
{
    const token=localStorage.getItem("token");
    const headers = {
        ...options.headers
    };

    if (token)
    {
        headers.Authorization = `Bearer ${token}`;
    }
    const response = await fetch(
        url,
        {
            ...options,
            headers: headers
        }
    );

    if(response.status===401)
    {
        if(onUnauthorized)
        {
            onUnauthorized();
        }
    }
    
    return response;
}

export default apiFetch;