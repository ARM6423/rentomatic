import jwt from 'jsonwebtoken'
import Landlord from '../models/landlordModel.mjs'
import Tenant from '../models/tenantModel.mjs'

const requireLandlordAuth = async (req,res,next) =>{

    //Pull auth from client
    const { authorization } = req.headers
    
    if(!authorization){
        return res.status(401).json({error: 'Auth Token Required, please sign in'})
    }

    const token = authorization.split(' ')[1]

    try{
        const {_id,role} = jwt.verify(token, process.env.TOKENKEY)
        const exist = await Landlord.findById({_id})

        if(!exist){
            throw 'Landlord Account Deleted'
        }

        if(role ==='TENANT'){
            throw 'Not Landlord'
        }
        req.landlordID = await Landlord.findOne({_id}).select('_id')
        next()

    }catch(err){
        
        console.log('Insufficient Authorization')
        res.status(403).json({error:'Insufficient Authorization'})

    }
    return

}

const requireBasicAuth = async (req,res,next) =>{

    //Pull auth from client
    const {authorization} = req.headers
    
    if(!authorization){
        return res.status(401).json({error: 'Auth Token Required, please sign in'})
    }

    const token = authorization.split(' ')[1]
    try{
        const {_id,role} = jwt.verify(token, process.env.TOKENKEY)
        var exist = null
        if(role ==='TENANT'){
            exist = await Tenant.findById({_id})
        }else {
            exist = await Landlord.findById({_id})
        }
        
        if(!exist){
            throw 'User Not found'
            }
        

        req.tenantID = await Tenant.findOne({_id}).select('_id')
        next()

    }catch(err){
        console.log(err)
        res.status(401).json({error:'Not Authorized'})

    }
    return
}

export {requireLandlordAuth,requireBasicAuth}