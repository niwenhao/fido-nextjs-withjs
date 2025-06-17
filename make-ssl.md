1. 認証局秘密キー作成
dev@LAPTOP-B72UN743:~/server-ssl$ openssl genrsa -out dev-ca.key 4096

2. 認証局証明書作成
dev@LAPTOP-B72UN743:~/server-ssl$ openssl req -x509 -new -nodes -key dev-ca.key -sha256 -days 3650 -out dev-ca.pem
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:JP
State or Province Name (full name) [Some-State]:TOKYO
Locality Name (eg, city) []:TOKYO
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Hyron
Organizational Unit Name (eg, section) []:Dev
Common Name (e.g. server FQDN or YOUR name) []:Dev-CA
Email Address []:niwenhao@hyron.co.jp

3. サーバ証明書秘密キー作成
openssl genrsa -out server.key 2048

4. サーバ証明書証明書署名要求
openssl req -new -key server.key -out server.csr
You are about to be asked to enter information that will be incorporated
into your certificate request.
What you are about to enter is what is called a Distinguished Name or a DN.
There are quite a few fields but you can leave some blank
For some fields there will be a default value,
If you enter '.', the field will be left blank.
-----
Country Name (2 letter code) [AU]:JP
State or Province Name (full name) [Some-State]:TOKYO
Locality Name (eg, city) []:TOKYO
Organization Name (eg, company) [Internet Widgits Pty Ltd]:Hyron
Organizational Unit Name (eg, section) []:Dev
Common Name (e.g. server FQDN or YOUR name) []:www.fido-dev.com
Email Address []:niwenhao@hyron.co.jp

Please enter the following 'extra' attributes
to be sent with your certificate request
A challenge password []:
An optional company name []:Hyron

5. サーバ証明書の追加情報作成
　※server.ext のような設定ファイルは、証明書に重要な**メタ情報（拡張）**を付けるために必要。
　※特に subjectAltName がないと、証明書は事実上使い物にならない。
　※openssl x509 ... -extfile server.ext で使用される。

dev@LAPTOP-B72UN743:~/server-ssl$ cat > server.ext
authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, keyEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = www.fido-dev.com

6. サーバ証明書の生成
dev@LAPTOP-B72UN743:~/server-ssl$ openssl x509 -req \
  -in server.csr \
  -CA dev-ca.crt -CAkey dev-ca.key -CAcreateserial \
  -out server.crt -days 365 -sha256 \
  -extfile server.ext
Certificate request self-signature ok
subject=C = JP, ST = TOKYO, L = TOKYO, O = Hyron, OU = Dev, CN = www.fido-dev.com, emailAddress = niwenhao@hyron.co.jp


