

function zip_dicts(dct_lst) {
    let ret= {}

    dct_lst.forEach( (d,i) => {
        Object.entries(d).forEach( ([attr,val]) => {
            if(!Object.prototype.hasOwnProperty.call(ret, attr)) {
                ret[attr]= Array(i).fill(null)
            }

            ret[attr].push(val)
        })
    })

    return ret
}

function sum_lst(lst) {
    return lst.reduce( (total,val) => {
        val= val || 0
        return (total + val)
    },0)
}


export {
    zip_dicts,
    sum_lst,
}