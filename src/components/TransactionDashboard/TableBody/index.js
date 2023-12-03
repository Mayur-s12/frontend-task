
import "./index.css"

const TableBody=(props)=>{
    const {items}=props
    const {id,category,title,image,description,sold, price}=items
    return(
         <tr>
                <td>{id}</td>
                <td id="fixed-box-title">{title}</td>
                <td id="fixed-box">{description}</td>
                <td>{price}</td>
                <td>{category}</td>
                <td>{sold}</td>
                <td><img src={image} className="imgage" alt={""}/></td>
        </tr>
    )
}


export default TableBody