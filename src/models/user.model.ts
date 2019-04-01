export class User {
    
    public $key: string;

    constructor(
        public nome: string,
        public usuario: string,
        public email: string,
        public photo: string
    ) { }
}