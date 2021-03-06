import Vue from 'vue'
import App from './App.vue'
import rawVm from '../data/vm'
import { install, vueInstanceOption } from './install'
import { createVM } from 'neutronium-vm-loader'

function getRouter(app){
    const viewModel = app.ViewModel
    if (!viewModel){
        return null;
    }
    return viewModel.Router;
}

function updateVM(raw) {
    const vm = createVM(raw);
    const router = getRouter(vm);
    if (router){
        router.BeforeResolveCommand = null
    }
    return vm;
}

const vm = updateVM(rawVm);

install(Vue)

var options = vueInstanceOption();
const { router } = options;
router.beforeEach((to, from, next) => {
    const name = to.name
    if (!name) {
        next({ name: 'main' })
        return
    }
    const vmFile = `../data/${name}/vm.cjson`
    console.log(vmFile);
    import(`../data/${name}/vm.cjson`).then(module => {
        const newVm = updateVM(module);
        console.log(newVm)
        router.app.ViewModel.CurrentViewModel = newVm.ViewModel.CurrentViewModel;
        next();
    }).catch(error => {
        console.log(error)
        console.log(`Problem loading file: "../data/${name}/vm.cjson". Please create corresponding file to be able to . ViewModel will be set to null.`)
        router.app.ViewModel.CurrentViewModel = null;
        next();
    })
})

const vueRootInstanceOption = Object.assign({}, options, {
    components: {
        App
    },
    data: vm
});
new Vue(vueRootInstanceOption).$mount('#main')
