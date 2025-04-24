import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "@/features/home/pages/Home"
import RootLayout from "@/layout/Layout"
import Paises from "@/features/paises/Paises"
import Estados from "@/features/estados/Estados"
import Cidades from "@/features/cidades/Cidades"
import Funcionarios from "@/features/funcionarios/Funcionarios"
import FormasPagamento from "@/features/formasPagamento/FormasPagamento"
import CondicoesPagamento from "@/features/condicaoPagamento/CondicaoPagamento"
import Fornecedores from "@/features/fornecedores/Fornecedores"

export default function App() {
  return (
    <Router>
      <RootLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/paises" element={<Paises />} />
          <Route path="/estados" element={<Estados />} />
          <Route path="/cidades" element={<Cidades />} />
          <Route path="/funcionarios" element={<Funcionarios />} />
          <Route path="/formas-pagamento" element={<FormasPagamento />} />
          <Route path="/condicoes-pagamento" element={<CondicoesPagamento />} />
          <Route path="/fornecedores" element={<Fornecedores />} />
        </Routes>
      </RootLayout>
    </Router>
  )
}
