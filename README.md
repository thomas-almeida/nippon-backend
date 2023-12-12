# nippon-backend
Backend para armazenamento e gerenciamento do nippon

### De uma dor, surge a oportunidade de subir de nível
Antes, as notas que eram criadas no app ficavam guardadas em um mini banco dentro do IndexDB do Electron, algo parecido com um localStorage mais detalhado e com tabelas simulando um banco simples. Porém isso se torna um problema já que caso o usuario desinstale o app ou queira migrar suas notas para outro dispositivo ele precisa portar o arquivo json das notas anteriores do dispositivo que estava usando, é uma forma arcaica que funcionou para lançar o app, mas que numa visão de escalar o projeto e torná-lo multiplataforma no futuro acabou virando um obstáculo. 

Por isso, me senti na obrigação de levantar o nível dos meus conhecimentos e sair da minha zona de conforto no FrontEnd e finalmente me aventurar, estruturar e entender a arquitetura que meu app necessita ter para ser um produto de fato, uma vez que realizando esse processo, vou alcançar um nível maior, tanto em um programador especialista em FrontEnd que entende a arquitetura de um projeto, quanto de alguém que almeja ser um líder técnico que sabe a contrução de um produto de ponta a ponta.


### Planejamento e Arquitetura
A princípio, minha ideia é a seguinte:
+ Um usuário pode criar sua conta (de preferencia com login social)
+ Todas as configurações e infos do usuário devem ser carregadas no DB online como
  + Nome de usuário pelo login social;
  + Chimper favorito (imagem de perfil);
  + Todas as notas que criar;
 
Com isso, o usuário poderá baixar o nippon de qualquer dispositivo e usar uma única conta com suas informações guardadas no DB, o diagrama de classes fica mais ou menos como:

![Diagrama](https://uploaddeimagens.com.br/imagens/hgUewxk](https://uploaddeimagens.com.br/images/004/689/405/full/Captura_de_tela_de_2023-12-12_18-47-51.png?1702417689)https://uploaddeimagens.com.br/images/004/689/405/full/Captura_de_tela_de_2023-12-12_18-47-51.png?1702417689)
