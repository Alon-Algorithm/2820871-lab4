async function searchCountry(countryName) {
    const countryInfo = document.getElementById('country-info');
    const borderSection = document.getElementById('bordering-countries');
    const spinner = document.getElementById('loading-spinner');
    const errorDiv = document.getElementById('error-message');

    spinner.style.display = 'block';
    countryInfo.innerHTML = '';
    borderSection.innerHTML = '';/* */
    errorDiv.textContent = '';

    try {
    /*  */
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) throw new Error('Country not found');
        
        const data = await response.json();
        const country = data[0]; 

        document.getElementById('country-info').innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="200">
        `;

    
        if (country.borders) {
            const borderCodes = country.borders.join(',');
            const borderRes = await fetch(`https://restcountries.com{borderCodes}`);

            const borders = await borderRes.json();

            borderSection.innerHTML = '<h3>Bordering Countries:</h3>';
            borders.forEach(neighbor => {
                const neighborDiv = document.createElement('div');
                neighborDiv.innerHTML = `
                    <p>${neighbor.name.common}</p>
                    <img src="${neighbor.flags.svg}" alt="${neighbor.name.common} flag" width="100">
                `;
                borderSection.appendChild(neighborDiv);
            });
        }

    } catch (error) {
        errorDiv.textContent = `Error: ${error.message}`;
    } finally {
        spinner.style.display = 'none';
    }
}


const btn = document.getElementById('search-btn');
btn.addEventListener('click', () => {
    const country = document.getElementById('country-input').value;
    searchCountry(country);
});

document.getElementById('country-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchCountry(e.target.value);
    }
});