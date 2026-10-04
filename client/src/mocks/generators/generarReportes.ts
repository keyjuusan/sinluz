import type { ReporteType } from "@/types";
import {faker} from "@faker-js/faker"
// TODO: Usar Faker para generar los datos
export function generarReportes(cantidad: number = 1): ReporteType[] {
  const reportesGenerados: ReporteType[] = Array.from({ length: cantidad }).map(() => {
    const reporteFake: ReporteType = {
      idUser: faker.number.int(2000),
      latitud: faker.number.float({  min: 6.922473157416403, max: 10.508285392288224,fractionDigits:14}),
      longitud: faker.number.float({ min: -432.14697265625006, max: -420.69946289062506, fractionDigits: 14 }),
      horas:faker.number.int(7)
    }

    return reporteFake
  })
  // console.log(reportesGenerados)
  return reportesGenerados
}
