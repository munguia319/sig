const fs=require('fs');
const path=require('path');
const dir='./supabase/migrations';
const files=fs.readdirSync(dir).filter(f=>f.endsWith('.sql'));
let content='DROP SCHEMA public CASCADE;\nCREATE SCHEMA public;\nGRANT ALL ON SCHEMA public TO postgres, anon, authenticated, service_role;\n';
files.forEach(f=>{
    let fileContent = fs.readFileSync(path.join(dir,f),'utf8');
    fileContent = fileContent.replace(/insert into storage\.buckets \(id, name, PUBLIC\)[\s\n]+values \('logos', 'logos', true\);/gi, '');
    fileContent = fileContent.replace(/insert into storage\.buckets \(id, name, PUBLIC\)[\s\n]+values \('avatars', 'avatars', true\);/gi, '');
    content += fileContent + '\n\n';
});
fs.writeFileSync('apply_this_in_sql_editor_RESET.sql', content);
