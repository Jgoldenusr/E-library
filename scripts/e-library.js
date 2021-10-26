//Nodelist creation separated by use
let formNode=document.querySelector('.mainForm');
let tableNode=document.querySelector('.mainTable');
let newButton=document.querySelector('.newButton');
let loadButton=document.querySelector('.loadButton');
let deleteButton=document.querySelector('.deleteButton');
let submitButton=document.querySelector('.submitButton');
let submitEditButton=document.querySelector('.submitEditButton');
//some important variables and classes
class Book{
    constructor(aName, anAuthor, somePages, aDate, anIndex){
        this.name=aName;
        this.author=anAuthor;
        this.pages=somePages;
        this.date=aDate;
        this.index=anIndex;
        this.read=false;
    }
}

let selectedIndex;

let bookArray=[];
if(localStorage.getItem('myBookArray')){
    bookArray=JSON.parse(localStorage.getItem('myBookArray'));
    populateTable(bookArray);
}
else{
    bookArray=[];
}
//main functions
function addNewBook(){
    tableNode.hidden=true;
    formNode.hidden=false;
    submitButton.hidden=false;
    submitEditButton.hidden=true;
}
function loadBookTable(){
    formNode.hidden=true;
    tableNode.hidden=false;
    submitButton.hidden=false;
    submitEditButton.hidden=true;
}
function deleteTable(){
    let tempNodeList=document.querySelectorAll('[data-index]');
    tempNodeList.forEach(aNode=>{aNode.remove()});
    localStorage.clear();
    bookArray=[];
}
function checkRead(){
    if(bookArray[this.closest('tr').dataset.index].read===false){
        bookArray[this.closest('tr').dataset.index].read=true;
        this.querySelector('img').src='svg/check.svg';
    }else{
        bookArray[this.closest('tr').dataset.index].read=false;
        this.querySelector('img').src='svg/invisible.svg';
    }
    localStorage.setItem('myBookArray', JSON.stringify(bookArray));
}
function rowDelete(){
    bookArray.splice(this.closest('tr').dataset.index,1)
    //se actualizan los index de cada libro
    for(let i=0; i<bookArray.length; i++){
        bookArray[i].index=i;
    }
    //actualizamos la tabla
    let tempNodeList=document.querySelectorAll('[data-index]');
    tempNodeList.forEach(aNode=>{aNode.remove()});
    //guardamos el array y poblamos la tabla
    localStorage.setItem('myBookArray', JSON.stringify(bookArray));
    populateTable(bookArray);
}
function rowEdit(){
    let formElements=formNode.elements;
    formElements.Nombre.value=bookArray[this.closest('tr').dataset.index].name;
    formElements.Autor.value=bookArray[this.closest('tr').dataset.index].author;
    formElements.Paginas.value=bookArray[this.closest('tr').dataset.index].pages; 
    formElements.Fecha.value=bookArray[this.closest('tr').dataset.index].date;
    selectedIndex=this.closest('tr').dataset.index;
    tableNode.hidden=true;
    formNode.hidden=false;
    submitButton.hidden=true;
    submitEditButton.hidden=false;
}
function submitBook(evt){
    evt.preventDefault();
    let formElements=formNode.elements;
    let myBook=new Book(formElements.Nombre.value, formElements.Autor.value, formElements.Paginas.value, formElements.Fecha.value, bookArray.length);
    bookArray.push(myBook);
    localStorage.setItem('myBookArray', JSON.stringify(bookArray));
    formElements.Nombre.value=""; formElements.Autor.value=""; 
    formElements.Paginas.value=""; formElements.Fecha.value="";
    populateTable(myBook);
}
function submitEdit(evt){
    evt.preventDefault();
    let formElements=formNode.elements;
    bookArray[selectedIndex].name=formElements.Nombre.value;
    bookArray[selectedIndex].author=formElements.Autor.value;
    bookArray[selectedIndex].pages=formElements.Paginas.value;
    bookArray[selectedIndex].date=formElements.Fecha.value;
    //actualizamos
    let tempNodeList=document.querySelectorAll('[data-index]');
    tempNodeList.forEach(aNode=>{aNode.remove()});
    //guardamos el array y poblamos la tabla
    localStorage.setItem('myBookArray', JSON.stringify(bookArray));
    populateTable(bookArray);
    formElements.Nombre.value=""; formElements.Autor.value=""; 
    formElements.Paginas.value=""; formElements.Fecha.value="";
    formNode.hidden=true;
    tableNode.hidden=false;
    submitButton.hidden=false;
    submitEditButton.hidden=true;
}
function populateTable(myBook){
    //si es un array de libros
    if(Array.isArray(myBook)===true){
        for(let i=0; i<myBook.length; i++){
            populateTable(myBook[i]);
        }
    }
    //para libros individuales
    else{
        let newRow=document.createElement('tr');
        //icono interactivo de leido/no leido
        let iconRow=document.createElement('td');
        iconRow.append(document.querySelector('th>img').cloneNode(true))
        if(myBook.read===false){
            iconRow.querySelector('img').src='svg/invisible.svg';
        }else{
            iconRow.querySelector('img').src='svg/check.svg';
        }
        iconRow.classList.add('svghover');
        iconRow.addEventListener('click', checkRead); 
        //icono interactivo para borrar
        let deleteRow=document.createElement('td');
        deleteRow.append(document.querySelector('th>img').cloneNode(true))
        deleteRow.querySelector('img').src='svg/delete.svg';
        deleteRow.classList.add('svghover')
        deleteRow.classList.add('borderlessthtd');
        deleteRow.addEventListener('click', rowDelete);
        //tablas restantes
        let nameRow=document.createElement('td'); nameRow.append(myBook.name); 
        nameRow.addEventListener('click', rowEdit);
        let authorRow=document.createElement('td'); authorRow.append(myBook.author);
        authorRow.addEventListener('click', rowEdit);
        let pagesRow=document.createElement('td'); pagesRow.append(myBook.pages);
        pagesRow.addEventListener('click', rowEdit);
        let dateRow=document.createElement('td'); dateRow.append(myBook.date);
        dateRow.addEventListener('click', rowEdit);
        newRow.append(deleteRow); newRow.append(iconRow); newRow.append(nameRow); 
        newRow.append(authorRow); newRow.append(pagesRow); newRow.append(dateRow);
        //le ponemos un index predeterminado
        newRow.dataset.index=myBook.index;
        tableNode.append(newRow);
    }
    
}

//event listeners
newButton.addEventListener('click', addNewBook);
loadButton.addEventListener('click', loadBookTable);
deleteButton.addEventListener('click', deleteTable);
submitButton.addEventListener('click', submitBook);
submitEditButton.addEventListener('click', submitEdit);
