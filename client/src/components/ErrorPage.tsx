import { useSearchParams } from "@solidjs/router";

const ErrorPage = () => {
    const [searchParams] = useSearchParams();

    if (searchParams.from) console.warn('Error From -', atob(searchParams.from))
    if (searchParams.stack) console.error('Error Param -', atob(searchParams.stack))

    let style = searchParams.statusCode!=='null' ? {"background": `no-repeat center url(https://http.cat/${searchParams.statusCode})`, color: 'transparent'} : {}

    return (
      <div class="flex flex-col justify-center items-center h-screen" style={style}>
        <div class="text-7xl">{
          searchParams.statusCode==='null'
            ? 'ERROR'
            : searchParams.statusCode
        }</div>
        <div>{atob(searchParams.message)}</div>
      </div>
    );
};

export default ErrorPage;
