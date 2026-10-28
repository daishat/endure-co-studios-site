const {test}=require('node:test');const assert=require('node:assert/strict');const fs=require('fs');const vm=require('vm');
const {validateContact}=require('../js/contact-form.js');
const genuine={name:'D’Aisha',email:'writer+studio@example.com',message:'Hello, I would like to discuss a writing project with your studio.',honey:''};
for(const name of ['D’Aisha','李明','José García','Mary-Jane O’Neil','Prince','J.','Алексей','أمل'])test('accepts name '+name,()=>assert.deepEqual(validateContact({...genuine,name}).errors,{}));
for(const email of ['person@example.com','writer+jobs@studio.example','first.last@sub.example.org'])test('accepts email '+email,()=>assert.deepEqual(validateContact({...genuine,email}).errors,{}));
for(const email of ['random','a@@example.com','a@','person example.com','x@example.com\r\nBcc:evil@example.com'])test('rejects bad email '+JSON.stringify(email),()=>assert.ok(validateContact({...genuine,email}).errors.email));
for(const name of ['   ','12345','https://spam.example','hello\nBcc:fake'])test('rejects bad name '+JSON.stringify(name),()=>assert.ok(validateContact({...genuine,name}).errors.name));
for(const message of ['','hi','                    ','abc123','aaaaaaaaaaaaaaaaaaaaaaaaa','123456789012345678901234','a'.repeat(5001)])test('rejects empty, short or obvious noise '+message.slice(0,8),()=>assert.ok(validateContact({...genuine,message}).errors.message));
test('permits three links for portfolios and briefs',()=>assert.deepEqual(validateContact({...genuine,message:genuine.message+' https://one.example https://two.example www.three.example'}).errors,{}));
test('rejects four links',()=>assert.ok(validateContact({...genuine,message:genuine.message+' https://one.example https://two.example https://three.example https://four.example'}).errors.message));
test('rejects repeated promotional lines',()=>assert.ok(validateContact({...genuine,message:('Please buy our advertising package today!\n').repeat(3)}).errors.message));
test('rejects repeated promotional phrases',()=>assert.ok(validateContact({...genuine,message:'Buy our amazing service! Buy our amazing service! Buy our amazing service!'}).errors.message));
test('keeps ordinary marketing and security inquiries',()=>assert.deepEqual(validateContact({...genuine,message:'I need help writing marketing content and a cybersecurity article for my business.'}).errors,{}));
test('honeypot blocks even a genuine-looking message',()=>assert.equal(validateContact({...genuine,honey:'bot filled this'}).blocked,true));
test('supports non-Latin messages without word-count assumptions',()=>assert.deepEqual(validateContact({...genuine,message:'您好我们希望与贵工作室合作开发一个新的原创故事项目请告知联系方式'}).errors,{}));
test('trims input',()=>assert.equal(validateContact({...genuine,name:'  Jane  '}).values.name,'Jane'));
function setup(){
 const field=value=>({value,custom:'',events:{},setCustomValidity(x){this.custom=x},addEventListener(k,f){this.events[k]=f},focus(){this.focused=true},reportValidity(){this.reported=true}});
 const fields={name:field(genuine.name),email:field(genuine.email),message:field(genuine.message),_honey:field('')};const form={elements:{namedItem:k=>fields[k]},addEventListener(k,f){this[k]=f}};
 vm.runInNewContext(fs.readFileSync(require('path').join(__dirname, '../js/contact-form.js'),'utf8'),{document:{getElementById:()=>form}});return {fields,form};
}
test('genuine submission retains native POST',()=>{const {form}=setup();let blocked=false;form.submit({preventDefault(){blocked=true}});assert.equal(blocked,false)});
test('invalid message is stopped, focused, and explained',()=>{const {form,fields}=setup();fields.message.value='hi';let blocked=false;form.submit({preventDefault(){blocked=true}});assert(blocked);assert(fields.message.custom);assert(fields.message.focused);fields.message.events.input();assert.equal(fields.message.custom,'')});
test('filled honeypot never submits',()=>{const {form,fields}=setup();fields._honey.value='bot';let blocked=false;form.submit({preventDefault(){blocked=true}});assert(blocked)});
