const express = require('express');
const app = express();
const methodOverride = require('method-override');

app.use(express.static('public'));
app.use(methodOverride('_method'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

const indexRoutes = require('./routes/indexRoutes');
const registerRoutes = require('./routes/registerRouter');
const loginRoutes = require('./routes/loginRouter');
const userPanelRoutes = require('./routes/userPanelRouter');
const creationRoutes = require('./routes/creationRouter');
const productCartRouter = require('./routes/productCartRouter');
const productDetailRoutes = require('./routes/productDetailRouter');
const productEditionRoutes = require('./routes/productEditionRouter');

app.use('/', indexRoutes);
app.use('/login', loginRoutes);
app.use('/registro', registerRoutes);
app.use('/crear', creationRoutes);
app.use('/userpanel', userPanelRoutes);
app.use('/carrito', productCartRouter);
app.use('/producto', productDetailRoutes);
app.use('/editar', productEditionRoutes);

app.listen(3030, () => {
    console.log('Servidor corriendo en el puerto http://localhost:3030');
});