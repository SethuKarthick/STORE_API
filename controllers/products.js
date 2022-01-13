const Product = require('../model/products');

const getAllProductsStatic = async (req, res) => {
    const products = await Product.find({ price: { $gt:30 }})
    .sort('name')
    .select('name price')
    .limit(10)
    res.status(200).json({products, count:products.length});
}

const getAllProducts = async (req, res) => {
    const { featured, company, name, sort, fields, numericFilers } = req.query;
    const queryObject = {}

    if(featured){
        queryObject.featured = featured === 'true' ? true : false
    }
    if (company){
        queryObject.company = company
    }
    if (name){
        queryObject.name = {$regex:name, $options:'i'}
    } 
     
    let results = Product.find(queryObject);
    if (sort){
        sortList = sort.split(',').join(' ')
        results = results.sort(sortList) 
    }
    else{
        results = results.sort('createdAt')
    }
    if (fields){
        fieldsList = fields.split(',').join(' ')
        results = results.select(fieldsList)
    }
    if (numericFilers){
        const operationMap = {
            '>' : '$gt',
            '>=' : '$gte',
            '=' : '$eq',
            '<' : '$lt',
            '<=' : '$lte',
        }
        const regEx = /\b(<|>|>=|=|<=)\b/g
        let filters = numericFilers.replace(regEx, (match) => `-${operationMap[match]}-`)
        const options = ['price', 'ratings']
        filters = filters.split(',').forEach((item) => {
            const [field, operator, value] = item.split('-')
            if (options.includes(field)){
                queryObject[field] = { [ operator ] : Number(value) }
            }
        })
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1) * limit
    // assumption --> to understand the logic
    // products = 23, pages = 4, limit = 7 --> (7, 7, 7, 2)
    results = results.skip(skip).limit(limit)
    
    const products = await results
    res.status(200).json({products, count:products.length} );
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}