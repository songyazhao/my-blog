# 👮 Web 安全

<!-- <div class="logos">
  <span class="md-logo">
    ![alt markdown logo](img/markdown-logo.svg)
  </span>
  <span class="webpack-logo">
    ![](img/webpack-logo.svg "webpack logo title")
  </span>
</div> -->

Web 应用中存在很多安全风险，这些风险会被黑客利用，轻则篡改网页内容，重则窃取网站内部数据，更为严重的则是在网页中植入恶意代码，使得用户受到侵害。

---

# 🤖 常见的安全漏洞

- ⚔ XSS 攻击：对 Web 页面注入脚本，使用 JavaScript 窃取用户信息，诱导用户操作。

- 👹 CSRF 攻击：伪造用户请求向网站发起恶意请求。<!-- .element: class="fragment" -->

- 🐠 钓鱼攻击：利用网站的跳转链接或者图片制造钓鱼陷阱。<!-- .element: class="fragment" -->

- 🌬 HTTP 参数污染：利用对参数格式验证的不完善，对服务器进行参数注入攻击。<!-- .element: class="fragment" -->

- 🌚 远程代码执行：用户通过浏览器提交执行命令，由于服务器端没有针对执行函数做过滤，导致在没有指定绝对路径的情况下就执行命令。<!-- .element: class="fragment" -->

---

# ⚔ XSS 攻击

XSS（cross-site scripting 跨域脚本攻击）攻击是最常见的 Web 攻击，其重点是`『跨域』`和`『客户端执行』`。

一般分为两类：<!-- .element: class="fragment" -->

- 🏓 Reflected XSS（反射型的 XSS 攻击）<!-- .element: class="fragment" -->

- 🛢 Stored XSS（存储型的 XSS 攻击）<!-- .element: class="fragment" -->

<!-- tips: 存储型XSS 也叫持久型XSS -->

--

# 🏓 反射型的 XSS 攻击

主要是由于服务端接收到客户端的不安全输入，不经过服务端存储，直接返给客户端后, 在客户端被浏览器解析触发执行 JS 脚本从而发起 Web 攻击。比如：

<!-- tips: 反射型XSS，顾名思义在于“反射”这个一来一回的过程。反射型XSS的触发有后端的参与，而之所以触发XSS是因为后端解析用户在前端输入的带有XSS性质的脚本或者脚本的data URI编码，后端解析用户输入处理后返回给前端，由浏览器解析这段XSS脚本，触发XSS漏洞。因此如果要避免反射性XSS，则必须需要后端的协调，在后端解析前端的数据时首先做相关的字串检测和转义处理；同时前端同样也需针对用户的数据做excape转义，保证数据源的可靠性。-->

👉 在某购物网站搜索物品，搜索结果会显示搜索的关键词。如果搜索关键词填入

```html
<script>alert('hello xiaoming')</script>
```

👉 然后点击搜索

😟 结果 ：页面没有对关键词进行过滤，这段代码就会直接在页面上执行，弹出 alert。<!-- .element: class="fragment" -->

--

# 🛢 存储型的 XSS 攻击

通过提交带有恶意脚本的内容存储在服务器上，当其他人看到这些内容时发起 Web 攻击。一般提交的内容都是通过一些 `『富文本编辑器』` 编辑的，很容易插入危险代码。

<!-- tips: 持久型XSS仍然需要服务端的参与，它与反射型XSS的区别在于XSS代码是否持久化到『硬盘』或者『数据库』。反射型XSS在执行过程中后端服务器仅仅将XSS代码保存在内存中，并未持久化，因此每次触发反射性XSS都需要由用户输入相关的XSS代码；
而持久型XSS则仅仅首次输入相关的XSS代码，保存在数据库中，当下次从数据库中获取该数据时在前端未加字串检测和excape转码时，会造成XSS，而且由于该漏洞的隐蔽性和持久型的特点，在多人开发的大型应用和跨应用间的数据获取时造成的大范围的XSS漏洞，危害尤其大。这就需要开发人员培养良好的前端安全防范意识，不仅仅不能相信用户的输入，也不能完全相信保存在数据库中的数据（即后端开发人员忽视的数据安全检测）。针对持久型XSS没有比较好的解决方式，只能由开发人员保证。当然规则是由开发者制定，如果忽略用户体验的话，可以制定一套严谨的输入规则。 -->

--

# ⚔🛡 XSS 的防范

前后端共同预防，针对用户输入的数据做解析和转义。
<!-- tips: 即使在客户端对用户的输入做了过滤、转义，攻击者一样可能，通过截包，转发，等手段，修改你的请求包体。最终还是要在数据输出的时候做数据转义。在后端接收前端的数据时做相关的字串检测和转义处理。 -->

- 对用户输入进行数据合法性验证。如:<!-- .element: class="fragment" -->

  <!-- tips: 这类合法性验证至少需要在服务器端进行以防止浏览器端验证被绕过，而为了提高用户体验和减轻服务器压力，一般最好也在浏览器端进行同样的验证。 -->

  - 输入 email 的文本框只允许输入格式正确的 email<!-- .element: class="fragment" -->

  - 输入手机号码的文本框只允许填入数字且格式需要正确<!-- .element: class="fragment" -->

- 在将不可信数据插入到 HTML URL 里时，对这些数据进行 URL 编码<!-- .element: class="fragment" -->

```html
  <a href="http://www.xxx.com?param=…插入不可信数据前，进行URL编码…"> Link Content </a>
```

<!-- .element: class="fragment" -->

- 在将不可信数据插入到 HTML 标签之间时，对这些数据进行 HTML Entity 编码。<!-- .element: class="fragment" -->

```
  <     ->    &amp;lt;
  >     ->    &amp;gt;
  /     ->    &amp;#x2f;
  '     ->    &amp;#x27;
  "     ->    &amp;quot;
  &     ->    &amp;amp;
```

<!-- .element: class="fragment" style="width: 180px" -->

```html
  <div>
    …插入不可信数据前，对其进行 HTML 实体编码…
    &lt;script&gt;
      alert(1)
    &lt;&#x2f;script&gt;
  </div>
```

<!-- .element: class="fragment" style="width: 450px" -->

--

- 在将不可信数据插入到 HTML 属性里时，对这些数据进行 HTML 属性编码

```html
  <div attr=…插入不可信数据前，进行HTML属性编码…></div> // 属性值部分没有使用引号，不推荐
  <div attr='…插入不可信数据前，进行HTML属性编码…'></div> // 属性值部分使用了单引号
  <div attr="…插入不可信数据前，进行HTML属性编码…"></div> // 属性值部分使用了双引号
```

<!-- tips: 由于很多地方都可能产生XSS漏洞，而且每个地方产生漏洞的原因又各有不同，所以对于XSS的防御来说，我们需要在正确的地方做正确的事情，即根据不可信数据将要被放置到的地方进行相应的编码，比如放到<div>标签之间的时候，需要进行HTML编码，放到<div>标签属性里的时候，需要进行HTML属性编码，等等。 -->

---

# 👹 CSRF 攻击

CSRF（Cross-site request forgery 跨站请求伪造，也被称为 One Click Attack 或者 Session Riding，通常缩写为 CSRF 或者 XSRF，是一种对网站的恶意利用。 CSRF 攻击会对网站发起恶意伪造的请求，严重影响网站的安全。

<!-- tips:
攻击者盗用了你的身份，以你的名义进行某些非法操作。CSRF能够使用你的账户发送邮件，获取你的敏感信息，甚至盗走你的财产。
当我们打开或者登陆某个网站的时候，浏览器与网站所存放的服务器将会产生一个会话(cookies)，在这个会话没有结束时，你就可以利用你的权限对网站进行操作。然而，攻击者就是利用这个特性，让受害者触发我们构造的表单或者语句，然后达到攻击者想要达到的目的。
至于用什么方法，需要攻击者去精心构造了，只要想象力丰富，就能发挥CSRF强大的破坏力 -->

--

# 👹🛡 CSRF 的防范

CSRF的防御可以从服务端和客户端两方面着手，防御效果是从服务端着手效果比较好，现在一般的CSRF防御也都在服务端进行。

<!-- 通常来说，对于 CSRF 攻击有一些通用的防范方案，简单的介绍几种常用的防范方案 -->

常用的四种防范方案：<!-- .element: class="fragment" -->

- 验证码<!-- .element: class="fragment" -->

- 验证 HTTP Referer<!-- .element: class="fragment" -->

- Token<!-- .element: class="fragment" -->

- 在 HTTP Header 中自定义属性并验证<!-- .element: class="fragment" -->

--

- 验证码：CSRF攻击的过程，往往是在用户不知情的情况下构造网络请求。所以如果使用验证码，那么每次操作都需要用户进行互动，从而简单有效的防御了CSRF攻击。

<!-- 但是如果你在一个网站作出任何举动都要输入验证码会严重影响用户体验，所以验证码一般只出现在特殊操作里面，或者在注册时候使用 -->

--

- 验证 HTTP Referer：在 HTTP 头中有一个字段叫 Referer，它记录了该 HTTP 请求的来源地址，可以用它来判断请求的合法性。

<!-- 通过检查Referer的值，我们就可以判断这个请求是合法的还是非法的，但是问题出在服务器不是任何时候都能接受到Referer的值，所以Refere Check 一般用于监控CSRF攻击的发生，而不用来抵御攻击。 -->

--

- Token：将 token 设置在 Cookie 中，在提交 post 请求的时候提交 Cookie，并通过 header 或者 body 带上 Cookie 中的 token，服务端进行对比校验。

<!-- 通过响应页面时将 token 渲染到页面上，在 form 表单提交的时候通过隐藏域提交上来。 -->
<!-- CSRF攻击要成功的条件在于攻击者能够预测所有的参数从而构造出合法的请求。所以根据不可预测性原则，我们可以对参数进行加密从而防止CSRF攻击。
另一个更通用的做法是保持原有参数不变，另外添加一个参数Token，其值是随机的。这样攻击者因为不知道Token而无法构造出合法的请求进行攻击。
Token 使用原则:
Token要足够随机————只有这样才算不可预测
Token是一次性的，即每次请求成功后要更新Token————这样可以增加攻击难度，增加预测难度
Token要注意保密性————敏感操作使用post，防止Token出现在URL中 -->

--

- 在 HTTP Header 中自定义属性并验证：信任带有特定的 header（例如 X-Requested-With: XMLHttpRequest）的请求。这个方案可以被绕过，所以 rails 和 django 等框架都放弃了该防范方式。

<!-- 这种方法也是使用 token 并进行验证，和上一种方法不同的是，这里并不是把 token 以参数的形式置于 HTTP 请求之中，而是把它放到 HTTP 头中自定义的属性里。通过 XMLHttpRequest 这个类，可以一次性给所有该类请求加上 csrftoken 这个 HTTP 头属性，并把 token 值放入其中。这样解决了上种方法在请求中加入 token 的不便，同时，通过 XMLHttpRequest 请求的地址不会被记录到浏览器的地址栏，也不用担心 token 会透过 Referer 泄露到其他网站中去。 -->

---

# 🐠 钓鱼攻击

- url 钓鱼

- 图片钓鱼

- iframe 钓鱼

---

# 🌬 HTTP 参数污染

Http Parameter Pollution（HPP)，即 HTTP 参数污染攻击。在 HTTP 协议中是允许同样名称的参数出现多次，而由于应用的实现不规范，攻击者通过传播参数的时候传输 key 相同而 value 不同的参数，从而达到绕过某些防护的后果。

HPP 可能导致的安全威胁有：<!-- .element: class="fragment" -->

- 绕过防护和参数校验。<!-- .element: class="fragment" -->

- 产生逻辑漏洞和报错，影响应用代码执行。<!-- .element: class="fragment" -->

---

# 🌚 远程代码执行

远程命令执行漏洞，用户通过浏览器提交执行命令，由于服务器端没有针对执行函数做过滤，导致在没有指定绝对路径的情况下就执行命令，可能会允许攻击者通过改变 $PATH 或程序执行环境的其他方面来在服务端执行一个恶意构造的代码。

---

XSS 和 CSRF 漏洞难以发现，但是作为开发人员需要于细节处避免制造漏洞，规范开发习惯，提高 WEB 开发安全意识 🤔。<!-- .element: class="text-center" -->

---

# 📚 扩展阅读：
[防御 XSS 的七条原则](http://www.freebuf.com/articles/web/9977.html)

[如何让前端更安全？——XSS攻击和防御详解](https://blog.csdn.net/wf2017/article/details/55504636)

[关于XSS（跨站脚本攻击）和CSRF（跨站请求伪造）](https://cnodejs.org/topic/50463565329c5139760c34a1)

[CSRF攻击与防御](https://blog.csdn.net/stpeace/article/details/53512283)

---

### The End 👋<!-- .element: class="text-center" -->
