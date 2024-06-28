const port = 4000; //portul de rulare a serverului
const ip = '0.0.0.0'; // Ascultă pe toate interfețele de rețea
const express = require("express"); // pentru creearea instantelor de aplicatie
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path"); //includem calea sererului (backend)
const cors = require("cors");
const { read } = require("fs");
const nodemailer = require('nodemailer'); // pentru trimiterea de email
const bcrypt = require("bcryptjs");
app.use(express.json()); //cu ajutorul express.json ce request vom primi din raspuns se va pasa prin json
app.use(cors()); //prin cors aplicatia noastra react.js se v-a conecta la aplicatia express prin portul 4000

// Database Connection with MongoDB
mongoose.connect("mongodb+srv://utilizator:utilizator@cluster0.wjlnzah.mongodb.net/Ecommerce");

//API Creation

app.get("/", (req, res) => {
    res.send("Merge serveruuuu")
})

//image storage engine

const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

//pasam un obiect : numele_request + 

const upload = multer({ storage: storage })

//creating upload endpoint for images
app.use('/images', express.static('upload/images'))

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    })
})

//Schema pentru creearea produselor

const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
})


//creare API pentru adaugare de produse
app.post('/addproduct', async (req, res) => {
    let products = await Product.find({});
    let id;
    if (products.length > 0) {
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id + 1;
    }
    else {
        id = 1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    });
    console.log(product);
    await product.save();
    console.log("Saved");
    res.json({
        success: true,
        name: req.body.name,
    })
})

//creare API pentru stergere de produse
app.post('/removeproduct', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name
    })
})

//creare API pentru luarea tuturor produselor
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("All products FETCHED");
    res.send(products);
})

// schema pentru crearea Utilizatorului

const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    isValid: {
        type: Boolean,
        default: false,
    }
});


// crearea API pentru inregistrarea utilizatorului
app.post('/signup', async (req, res) => {
    let check = await Users.findOne({ email: req.body.email });
    if (check) {
        return res.status(400).json({ success: false, errors: "Existing user found with same email adress!" })
    }
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i] = 0;
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);


        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: hashedPassword,//req.body.password,
            cartData: cart,
            isValid: false
        });

        await user.save();

        const validationToken = jwt.sign({ id: user.id }, 'secret_ecom', { expiresIn: '1d' });
        sendValidationEmail(user, validationToken);

        res.json({ success: true, message: 'Verification email sent. Please check your inbox.' });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ success: false, errors: "Server error. Please try again." });
    }
});

//creare API pentru logarea utilizatorului
app.post('/login', async (req, res) => {
    try {
        let user = await Users.findOne({ email: req.body.email });
        if (user) {
            if (!user.isValid) {
                return res.status(400).json({ success: false, errors: "Please verify your email address to log in." });
            }
            //const passCompare = req.body.password === user.password;
            const passCompare = await bcrypt.compare(req.body.password, user.password);
            if (passCompare) {
                const data = {
                    user: {
                        id: user.id
                    }
                }
                const token = jwt.sign(data, 'secret_ecom');
                res.json({ success: true, token });
            } else {
                res.json({ success: false, errors: "Wrong Password!" });
            }
        } else {
            res.json({ success: false, errors: "Wrong Email address!" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, errors: "Server error. Please try again." });
    }
});


//creearea API pentru noile colectii
app.get('/newcollections', async (req, res) => {
    let products = await Product.find({});

    //ultimile 8 elemente adaugate
    let newcollections = products.slice(1).slice(-8);

    console.log("Newcollection Fetched");
    res.send(newcollections);
})

//creearea API pentru populare
app.get('/popular', async (req, res) => {
    let products = await Product.find({ category: "women" });
    let popular = products.slice(0, 4);
    console.log("Popular fetched");
    res.send(popular);
})

//crearea middleware pentru feth a utilizatorului
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ errors: "Please authenticate using valid token!" })
    }
    else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({ errors: "Please authenticate using valid token!" })
        }
    }
}

//creearea API pentru adaugarea de produse in cart
app.post('/addtocart', fetchUser, async (req, res) => {
    console.log("saved: ", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added")
})

//creeam API sa stergem produs din cart
app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("removed: ", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0)
        userData.cartData[req.body.itemId] -= 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Removed")
})

//cream API sa colectam produsele din cart
app.post('/getcart', fetchUser, async (req, res) => {
    console.log("GetCart");
    let userData = await Users.findOne({ _id: req.user.id })
    res.json(userData.cartData);
})

app.listen(port, (error) => {
    if (!error) {
        console.log("Server running on Port: " + port)
    }
    else {
        console.log("Error: " + error)
    }
})

const sendValidationEmail = (user, token) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'popmaria1401@gmail.com',
            pass: 'ijao rwwe scbo asjm'
        }
    });

    const mailOptions = {
        from: 'popmaria1401@gmail.com',
        to: user.email,
        subject: 'Email Verification',
        text: `Please verify your email by clicking the following link:http://localhost:4000/verify-email?token=${token}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
};

// creeare API pentru validare adresa mail
app.get('/verify-email', async (req, res) => {
    const token = req.query.token;

    try {
        const decoded = jwt.verify(token, 'secret_ecom');
        await Users.findByIdAndUpdate(decoded.id, { isValid: true });
        res.send('Email successfully verified. You can now log in.');
    } catch (error) {
        res.status(400).send('Invalid or expired token.');
    }
});


// creeare API pentru resetarea cartului
// Route pentru resetarea coșului de cumpărături
app.post('/resetcart', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findOne({ _id: req.user.id });
        const zeroedCartItems = {};

        // Inițializează toate elementele coșului cu valoarea 0
        Object.keys(userData.cartData).forEach(itemId => {
            zeroedCartItems[itemId] = 0;
        });

        // Actualizează cartData în baza de date pentru utilizatorul curent
        await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: zeroedCartItems });

        res.json({ success: true, message: 'Cart items reset successfully.' });
        console.log("Golire cos");
    } catch (error) {
        console.error("Error while resetting cart:", error);
        res.status(500).json({ success: false, error: 'Failed to reset cart items.' });
    }
});


// Definirea schemei pentru colecția 'orders'
const Orders = mongoose.model('Orders', {
    telephone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    cardNumber: {
        type: String,
        required: true,
    },
    cvv: {
        type: String,
        required: true,
    },
    expiration: {
        type: String,
        required: true,
    },
    cardName: {
        type: String,
        required: true,
    },
    cartItems: {
        type: Object,
        required: true,
    },
    total: {
        type: Number,
        required: true,
    },
    purchaseDate: {
        type: String,
        default: function () {
            return new Date().toString();
        },
    },
    isComplete: {
        type: Boolean,
        default: false,
    }
});

app.post('/payment', async (req, res) => {
    try {
        const { telephone, address, cardNumber, cvv, expiration, cardName, cartItems, total, purchaseDate } = req.body;

        // Creează un nou obiect Order folosind schema definită
        const newOrder = new Orders({
            telephone: req.body.telephone,
            address: req.body.address,
            cardNumber: req.body.cardNumber,
            cvv: req.body.cvv,
            expiration: req.body.expiration,
            cardName: req.body.cardName,
            cartItems: req.body.cartItems,
            total: req.body.total,
        });

        await newOrder.save();
        res.status(201).json({ success: true, message: 'Order saved successfully.' });
        console.log("Order saved");
    } catch (error) {
        console.error('Error saving order:', error);
        res.status(500).json({ success: false, message: 'Failed to save order.' });
    }
});

// API pentru a vedea toate comenzile ne trimise
app.get('/allorders', async (req, res) => {
    try {
        let orders = await Orders.find({ isComplete: false });
        res.json(orders);
        console.log("Orders Fetched");
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch orders.' });
    }
});

// API pentru a complecta o comanda
app.post('/completeOrder', async (req, res) => {
    try {
        await Orders.findByIdAndUpdate(req.body.id, { isComplete: true });
        res.json({ success: true, message: 'Order marked as complete.' });
        console.log("Order marked as complete");
    } catch (error) {
        console.error('Error marking order as complete:', error);
        res.status(500).json({ success: false, message: 'Failed to mark order as complete.' });
    }
});
