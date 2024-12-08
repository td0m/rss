// RawSQL class holds both the sql query string and the bind parameters
export class RawSQL {
    _query = [];
    _params = [];

    constructor(query) {
        if (query) this._query.push(query);
    }

    toString() {
        // nicely formats the sql string
        return `query: ${this.sql.replace(/ {2,}/, ' ')}, params: ${JSON.stringify(this.params)}`;
    }

    append(other) {
        this._params.push(...other._params);
        this._query.push(...other._query);
    }

    get sql() {
        let i = 1;
        //return this._query.map(str => (str === '?' ? '$' + (i++).toString() : str)).join('');
        return this._query.join('')
    }

    get params() {
        return this._params;
    }

    addParam(param) {
        this._params.push(param);
        this._query.push('?');
    }
}

// sql safely constructs an instance of RawSQL from a tagged template literal
// e.g. sql`select id from users where email=${email}` will be safely turned into `RawSQL`
export function sql(literals, ...args) {
    const stmt = new RawSQL();
    literals.raw.forEach((lit, i) => {
        if (i > 0) {
          const arg = args[i - 1];
          if (arg instanceof RawSQL) {
              stmt.append(arg);
          } else if (i > 0) {
              stmt.addParam(arg);
          }
        }
        stmt.append(new RawSQL(lit));
    }, '');
    return stmt;
}
