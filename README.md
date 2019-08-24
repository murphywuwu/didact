> A didactic alternative to React.
## Demos
[hello-world](https://rawgit.com/hexacta/didact/master/examples/hello-world/index.html)  
[hello-world-jsx](https://rawgit.com/hexacta/didact/master/examples/hello-world-jsx/index.html)  

实例化根节点在调用`mount`方法时

递归重复该步骤
1. 通过虚拟节点构建真实节点
2. 虚拟子节点实例化
3. 通过实例化子节点构建真实子节点，并插入父节点

如图为，实例化子节点以及构建真实子节点的顺序
![image](https://user-images.githubusercontent.com/12481194/63635202-7a3f3b80-c692-11e9-98ae-28b28fbe5b3f.png)

## License

MIT © [Hexacta](https://www.hexacta.com)