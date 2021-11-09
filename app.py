from ariadne import QueryType, graphql_sync, make_executable_schema,gql
from ariadne.constants import PLAYGROUND_HTML
from flask import Flask, render_template, url_for, flash, redirect,jsonify,request
from forms import RegistrationForm, LoginForm

games = [
    {
        'developer': 'EA',
        'title': 'FIFA12',
        'category': 'Sport',
        'rate': 'PG8'
    },
    {
        'developer': 'Rock Game',
        'title': 'GTAV',
        'category': 'Action',
        'rate': 'PG18'
    }
]

# GraphQL Resolvers
query = QueryType()

@query.field("logIn")
def resolve_logIn(*_,email,password):
    return "111"

# GraphQL Schema
with open("schema.gql","r") as source:
    schema_sdl = source.read()
type_defs = gql(schema_sdl)
schema = make_executable_schema(type_defs,query)
    
app = Flask(__name__)
app.config['SECRET_KEY'] = '5791628bb0b13ce0c676dfde280ba245'

@app.route("/")
@app.route("/home")
def home():
    return render_template('home.html', games=games)


@app.route("/about")
def about():
    return render_template('about.html', title='About')

@app.route("/register", methods=['GET', 'POST'])
def register():
    form = RegistrationForm()
    if form.validate_on_submit():
        flash(f'Account created for {form.username.data}!', 'success')
        return redirect(url_for('home'))
    return render_template('register.html', title='Register', form=form)


@app.route("/login", methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        if form.email.data == 'admin@blog.com' and form.password.data == 'password':
            flash('You have been logged in!', 'success')
            return redirect(url_for('home'))
        else:
            flash('Login Unsuccessful. Please check username and password', 'danger')
    return render_template('login.html', title='Login', form=form)

@app.route("/graphql",methods=["GET"])
def graphql_playground():
    return PLAYGROUND_HTML, 200

@app.route("/graphql",methods=["POST"])
def graphql_server():
    data = request.get_json()
    success, result = graphql_sync(
        schema,
        data,
        context_value=request,
        debug=app.debug
    )

    status_code = 200 if success else 400
    return jsonify(result), status_code

if __name__ == '__main__':
    app.run(debug=True)
