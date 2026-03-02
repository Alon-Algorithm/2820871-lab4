async function searchCountry(countryName) {
    const countryInfo = document.getElementById('country-info');
    const borderSection = document.getElementById('bordering-countries');
    const spinner = document.getElementById('loading-spinner');
    const errorDiv = document.getElementById('error-message');

    spinner.style.display = 'block';
    countryInfo.innerHTML = '';
    borderSection.innerHTML = '';
    errorDiv.textContent = '';

    try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${encodeURIComponent(countryName)}?fullText=true`);
        if (!response.ok) throw new Error('Country not found');
        
        const data = await response.json();
        const country = data[0]; 

        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="200">
        `;

        if (country.borders && country.borders.length > 0) {
            borderSection.innerHTML = '<h3>Bordering Countries:</h3>';
            
            
            const borderCodes = country.borders.join(',');
            const borderRes = await fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes}`);
            
            if (!borderRes.ok) throw new Error('Failed to fetch bordering countries');
            
            const borderData = await borderRes.json();
            
            
            const borderContainer = document.createElement('div');
            borderContainer.style.display = 'flex';
            borderContainer.style.flexWrap = 'wrap';
            borderContainer.style.gap = '20px';
            
            borderData.forEach(neighbor => {
                if (neighbor && neighbor.name) {
                    const neighborDiv = document.createElement('div');
                    neighborDiv.style.textAlign = 'center';
                    
                    const name = neighbor.name?.common || "Unknown";
                    const flag = neighbor.flags?.svg || "";

                    neighborDiv.innerHTML = `
                        <p><strong>${name}</strong></p>
                        <img src="${flag}" alt="${name} flag" width="100" style="border: 1px solid #ddd; border-radius: 4px;">
                    `;
                    borderContainer.appendChild(neighborDiv);
                }
            });
            
            borderSection.appendChild(borderContainer);
        } else {
            borderSection.innerHTML = '<p>No bordering countries.</p>';
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
    if (country.trim()) {
        searchCountry(country);
    }
});

document.getElementById('country-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const country = e.target.value;
        if (country.trim()) {
            searchCountry(country);
        }
    }
});