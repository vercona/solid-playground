const fetchQueries = async () => {
    const response = await fetch("http://localhost:8080/");
    // const response = await fetch("http://localhost:8080/addUser", {
    //     method: "POST",
    //     body: JSON.stringify({user: "BOB2"})
    // });
    const formattedResponse = await response.json();
    console.log(formattedResponse);
};

fetchQueries();