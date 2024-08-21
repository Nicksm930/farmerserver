
import mongoose from 'mongoose'

const productSchema=new mongoose.Schema({
    
  /* Stores info of products */
  product_name:{
    type:String,
    required:true,
    unique:true
  },
  title: {
    type: String
  },
  subTitle: {
    type: String
  },
  quantity: {
    type: Number
  },
  pulseType: {
    type:String,
    enum:["ToorDal(PigeonPea)","MoongDal(GreenGram)",
        "MasoorDal(RedLentil)",
        "ChanaDal(BengalGram)",
        "UradDal(BlackGram)",
        "Rajma(KidneyBeans)",
        "KabuliChana(Chickpeas)",
        "Lobia(Black-EyedPeas)",
        "MatarDal(SplitPeas)",
        "ArharDal",
        "MothBeans",
        "KulthiDal(HorseGram)",
        "MasoorWhole(WholeRedLentil)",
        "MoongWhole(WholeGreenGram)",
        "AdzukiBeans(RedBeans)",
        "MochaDal(BengalGramHusked)",
        "GreenPeas"
        ],
    default:"ChanaDal(BengalGram)"
    
  },
  subType: {
    type: String
  },
  minimum_buy_quantity: {
    type: Number
  },
  price: {
    type: Number
  },
  discount: {
    type: Number
  },
  package_date: {
    type: Date
  },
  expiry_date: {
    type: Date
  },
  images: {
    type: Array
  },
  descriptio: {
    type: String
  },
  return_policy: {
    type: String
  },
  availability: {
    type: Boolean
  }
}

,
{
    timestamps:true
}
)

export const Product=mongoose.model("Product",productSchema)