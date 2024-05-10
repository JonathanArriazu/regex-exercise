/* 
Estábamos aburridos y planteamos un Web Crawler (Un pequeño software que entra a distintas páginas web y extrae cierta información de las mismas) para Mercado Libre y páginas de compras similares. El mismo nos terminó devolviendo una lista de productos con sus precios y ocasionalmente su puntuación. 
El objetivo que tenemos ahora es; extraer esta información de las distintas respuestas entregadas por este Web Crawler.

Para esto, existen ciertas reglas comunes en la respuesta del Web Crawler; cada conjunto de información de una página se devuelve en una línea separada. Cada línea está compuesta por:
el producto,
una separación por un signo igual (=),
el precio, que puede ser un número entero o decimal y siempre se va a encontrar a la derecha del signo igual,
y la valoración, que no siempre estará disponible, pero cuando se encuentre siempre estará del lado derecho del signo igual y entre paréntesis.
Por ejemplo: "Camisa Azul = 9499.99 (4.3/5)"

Como respuesta, queremos una lista de productos con sus respectivos nombres, precios (Todos con dos decimales) y respectiva valoración en caso de contar con una (Tal cual se encontraban) para las salidas dadas del Web Crawler.

Primer nivel - Ejemplo de Entrada:

Aspiradora=45200
Madera Balsa x 100gr =965 (7 de 10)
Jamón cocido xKg = 4750.75 (42 estrellas de 100)
Camisa Azul marca Polo = 9499.9 (4.3/5)


Ejemplo de Salida:
Productos: [ 
  { nombre: "Aspiradora", precio: 45200 }, 
  { nombre: "Madera Balsa x 100gr", precio: 965, valoracion: "7 de 10" }
  { nombre: "Jamón cocido xKg", precio: 4750.75, valoracion: "42 estrellas de 100" }
  { nombre: "Camisa Azul marca Polo", precio: 9499.90, valoracion: "4.3/5" }
]
 */

/* const string = `Aspiradora=45200
Madera Balsa x 100gr =965 (7 de 10)
Jamón cocido xKg = 4750.75 (42 estrellas de 100)
Camisa Azul marca Polo = 9499.9 (4.3/5)`

const parenthesisRegex = /\((.*?)\)/g;
const removeParenthesis = /[()]/g

const stringOneLine = string.replace(/\n/g, ',');
const stringToArray = stringOneLine.split(',')

const arrayToObject = stringToArray.map( value => {

    const ratings = [];

    const items = value.split("=")
    const itemName = items[0].trim();
    const priceAndRating  = items[1].trim();
    const itemPrice = priceAndRating.split(' ')[0];
    //const matches = priceAndRating.match(parenthesesRegex);

    const results = priceAndRating.match(parenthesisRegex);

    if(results){
        results.forEach(result => {
            const rating = result.replace(removeParenthesis, '')
            ratings.push(rating)
        })
    }

    return {
       name: itemName,
       price: itemPrice,
       ratings: ratings[0]
    }
})

console.log(arrayToObject) */



/* 

Segundo nivel
Luego de ir viendo diversas respuestas dadas por el Web Crawler, nos dimos cuenta que a veces las separaciones entre el producto y su información adicional las hace con el signo dos puntos (:) y otras veces con una flecha (->) en vez de solo con el signo igual (=).
Adicionalmente, el precio, muchas veces puede venir con el signo pesos ($). 

Por lo tanto, nos gustaría dar soporte a este tipo de respuestas también, incluyendo las anteriores.

Ejemplo de Entrada:

Anteojos de sol del Diego: $230666
Ropero antiguo -> (9 de 10) $14500.6
Sandalias de Sakura Card Captors marca eToys: (12 de 10 estrellas) 1210

Ejemplo de Salida:
Productos: [ 
  { nombre: "Anteojos de sol del Diego", precio: 230666.00 }, 
  { nombre: "Ropero antiguo", precio: 14500.60, valoracion: "9 de 10" },
  { nombre: "Sandalias de Sakura Card Captors marca eToys", precio: 1210.00, valoracion: "12 de 10 estrellas" }
]

const string = `Anteojos de sol del Diego: $230666
Ropero antiguo -> (9 de 10) $14500.6
Sandalias de Card Captors marca eToys: (12 de 10 estrellas) 1210`;

const regexNombre = /^(.*?)(?==|:|->)/;
const regexPrecio = /\b\d+(?:\.\d+)?\b(?![^(]*\))/g;
const regexRating = /\((.*?)\)/g;

const removeParenthesis = /[()]/g

const stringOneLine = string.replace(/\n/g, ',');
const stringToArray = stringOneLine.split(',')

const results = stringToArray.map( result => {
    const nameRegex = result.match(regexNombre);
    const priceRegex = result.match(regexPrecio);
    const ratingRegex = result.match(regexRating);

    const name = nameRegex ? nameRegex[1].trim(): '';
    const price = priceRegex ? priceRegex[0] : null;
    const rating = ratingRegex ? ratingRegex[0].replace(removeParenthesis, '') : null;

    return {
        name: name,
        price: price,
        ratings: rating
     }
} )

console.log(results) */

/* 

Tercer Nivel
A medida que fuimos usando esto, nos dimos cuenta que muchas publicaciones de productos venían en distinta moneda, lo cual mucho de la información que estábamos extrayendo no tenía realmente demasiado sentido. Así que queremos discriminar en qué moneda fue hecha la publicación. 

Por defecto, nos encontramos que el peso argentino es la moneda más común para las publicaciones que estamos extrayendo. Así que en caso de no especificar una moneda, vamos a asumir que la publicación está en pesos argentinos ($). En caso que esté publicado en dólares, siempre se encontrará escrito como us$. El resto de monedas, se incluye su signo como tal. 

Ejemplo de Entrada:
Combo de 15 Tuppers en diversos tamaños = $24899.99 (3.35/5)
Lapicera Birome con entradas de regalo para ver a Taylor Swift: us$350
Buzo "London" marca Persia Hnos. -> (10 estrellas de 10, totalmente inalterado) £199.9
Revólver musical de Frozen: ¥43.29

Ejemplo de Salida: 
Productos: [ 
  { nombre: "Combo de 15 Tuppers en diversos tamaños", precio: 24899.99, moneda: "$", valoracion: "3.35/5" }, 
  { nombre: "Lapicera Birome con entradas de regalo para ver a Taylor Swift", precio: 350.00, moneda: "us$" },
  { nombre: 'Buzo "London" marca Persia Hnos.', precio: 199.90, moneda: "£", valoracion: "10 estrellas de 10, totalmente inalterado" },
  { nombre: "Revólver musical de Frozen", precio: 43.29, moneda: "¥" }
]

*/

const string = `Combo de 15 Tuppers en diversos tamaños = $24899.99 (3.35/5)
Lapicera Birome con entradas de regalo para ver a Taylor Swift: us$350
Buzo "London" marca Persia Hnos. -> (10 estrellas de 10 totalmente inalterado) £199.9
Revólver musical de Frozen: ¥43.29`

const regexNombre = /^(.*?)(?==|:|->)/;
const regexRating = /\((.*?)\)/g;
const regexPrecio = /(?<=\$|€|£|¥|₽)\s*\d+(\.\d+)?/g;
const countryCurrenciesRegex = /(\$|€|£|¥|₽|us\$)/g;

const removeParenthesis = /[()]/g

const stringOneLine = string.replace(/\n/g, '%');
const stringToArray = stringOneLine.split('%')

const results = stringToArray.map( result => {
    const nameRegex = result.match(regexNombre);
    const priceRegex = result.match(regexPrecio);
    const ratingRegex = result.match(regexRating);
    const currencyRegex = result.match(countryCurrenciesRegex);

    const name = nameRegex ? nameRegex[1].trim(): '';
    const price = priceRegex ? priceRegex[0] : null;
    const currency = currencyRegex ? currencyRegex[0]: null;
    const rating = ratingRegex ? ratingRegex[0].replace(removeParenthesis, '') : null;

    return {
        name: name,
        price: price,
        currency: currency,
        ratings: rating
    }
} )

console.log(results)


/* 

Reto Adicional
Nos dimos cuenta que muchos de estos productos suelen tener "marca <Nombre de la Marca>", aunque el nombre de la marca no siempre está escrito de la misma manera (En resumen, agnóstico de las mayúsculas/minúsculas). Por lo que nos gustaría poder discriminar todos los productos que estén bajo la misma marca y mostrarlos agrupados. En caso que no tengan marca, irían agrupados en "Sin marca especificada".

Adicionalmente, se nos complica la lectura de algunos símbolos de monedas, por lo que preferimos que para los símbolos:
"$" nos guarde como moneda "Peso Argentino"
"us$" nos guarde como moneda "Dólar"
"€" nos guarde como moneda "Euro"

Ejemplo de Entrada:
Tanque K9 Thunder marca Samsung: us$ 9150499 (367 valoraciones altas)
Combo Dulce de leche con salmuera: $1790 (97/100)
Mortadela x100 gr marca Paladini -> 649.95
Paquete de Cigarrillos de la mujer maravilla: (99/100) ¥10
Cinturón WELT marca SAMSUNG = €184.56

Ejemplo de Salida:
Productos: {
  samsung: [
    { nombre: 'Tanque K9 Thunder', precio: 9150499.00, moneda: "Dólar", valoracion: "367 valoraciones altas" },
    { nombre: 'Cinturón WELT', precio: 184.56, moneda: "Euro" },
  ],
  paladini: [
    { nombre: 'Mortadela x100 gr', precio: 649.95, moneda: "Peso Argentino" },
  ],
  "Sin marca especificada": [
    { nombre: 'Combo Dulce de leche con salmuera', precio: 1790.90, moneda: "Peso Argentino", valoracion: "97/100" },
    { nombre: 'Paquete de Cigarrillos de la mujer maravilla', precio: 10.00, moneda: "¥", valoracion: "99/100" },
  ]
}

*/


