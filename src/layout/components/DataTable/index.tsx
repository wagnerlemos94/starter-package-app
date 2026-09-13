import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Box,
	Switch,
	Container,
	Button as Button_M,
	TablePagination
} from "@mui/material";
import Link from "next/link";
import Loading from "@/components/Loading";
import ConfirmModal from '@/components/ConfirmModal';
import { Delete, Edit } from "@mui/icons-material";
import Button from "../Button";
import { DataTableProps } from "./types";
import { useDataTable } from "./useDataTable";


export function DataTable<T extends object>({ columns, data, className, titulo = "", buttonCadastro, resource, loading = false, action, containerProps, getRowKey }: DataTableProps<T>) {

	const {
		action: {
			handleDeleteClick,
			handleConfirmDelete,
			setConfirmOpenDelete,
			setConfirmOpenStatus,
			handleConfirmStatus,
			setRowsPerPage,
			setPage,
			handleInativarClick,
			hasPermission
		},
		data: {
			modalCancelText,
			modalConfirmText,
			modalTitle,
			confirmOpenDelete,
			confirmOpenStatus,
			rowsPerPage,
			page,
		}
	} = useDataTable<T>(
		{ action }
	);

	const visibleRows = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
	const readValue = (row: T, key: string | keyof T): unknown => Reflect.get(row, String(key));

	return (
		<Container maxWidth={'xl'} sx={{ py: { xs: 2, md: 4 } }}>

			<TableContainer
				component={Paper}
				className={className}
				{...containerProps}
				sx={{
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					minHeight: '100%',
					padding: { xs: 2, sm: 3, md: 4 },
					borderRadius: 3,
					border: '1px solid #E5E7EB',
					boxShadow: '0 1px 3px rgba(15, 23, 42, 0.06)',
					...containerProps?.sx,
				}}
			>
				<Box sx={{ marginTop: 0, marginBottom: 2 }}>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<div>
							<h1 style={{ margin: 0, padding: 0 }}>{titulo}</h1>
						</div>
						<div>
							{buttonCadastro && hasPermission(resource, 'CREATE') && (
								<Link href={buttonCadastro.redirect ?? "#"} style={{ textDecoration: 'none' }}>
									<Button
										nome={buttonCadastro.nome}
										onClick={buttonCadastro.onChange}
										icon={buttonCadastro.icon}
									/>
								</Link>
							)}
						</div>
					</div>
				</Box>
				<Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
					<Table sx={{ width: '100%', flex: 1, height: '100%' }}>
						<TableHead sx={{ backgroundColor: "#F8FAFC" }}>
							<TableRow>
								{columns.map((col) => (
									<TableCell key={String(col.key)}>{col.label}</TableCell>
								))}
								{action && (hasPermission(resource, 'UPDATE') || hasPermission(resource, 'DELETE')) && (
									<TableCell key="actions">Ações</TableCell>
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							{data.length === 0 ? (
								<TableRow style={{ height: '60vh' }}>
									<TableCell colSpan={columns.length} align="center" style={{ height: '60vh', verticalAlign: 'middle' }}>
										Nenhum dado encontrado
									</TableCell>
								</TableRow>
							) : (
								visibleRows.map((row: T, idx) => (
									<TableRow key={getRowKey?.(row, idx) ?? page * rowsPerPage + idx} hover>
										{columns.map((col) => (
											<TableCell key={String(col.key)}>
												{col.render ? col.render(readValue(row, col.key), row) : String(readValue(row, col.key) ?? '')}
											</TableCell>
										))}
										{action && (hasPermission(resource, 'UPDATE') || hasPermission(resource, 'DELETE')) && (
											<TableCell>
												{action.edit && hasPermission(resource, 'UPDATE') && (
													<Button_M disabled={action.edit.disabled?.(row)} size="small" color="primary" onClick={() => action?.edit?.onChange(row)}><Edit fontSize="small" /></Button_M>
												)}
												{action.status && hasPermission(resource, 'UPDATE') && (
													<Button_M disabled={action.status.disabled?.(row)} size="small" onClick={() => handleInativarClick(row)}><Switch color="success" checked={action.status.checked(row)}></Switch></Button_M>
												)}
												{action.delete && hasPermission(resource, 'DELETE') && (
													<Button_M disabled={action.delete.disabled?.(row)} size="small" color="error" onClick={() => handleDeleteClick(row)}><Delete fontSize="small" /></Button_M>
												)}
											</TableCell>
										)}
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</Box>
				<Loading isLoading={loading} />

				<ConfirmModal
					open={confirmOpenDelete}
					setOpen={setConfirmOpenDelete}
					title={modalTitle}
					description={'Deseja realmente excluir este item?'}
					confirmText={modalConfirmText}
					cancelText={modalCancelText}
					onConfirm={handleConfirmDelete}
				/>
				<ConfirmModal
					open={confirmOpenStatus}
					setOpen={setConfirmOpenStatus}
					title={'Confirmar alteração de status'}
					description={'Deseja realmente alterar o status deste item?'}
					confirmText={'Alterar'}
					cancelText={'Cancelar'}
					onConfirm={handleConfirmStatus}
				/>
				<TablePagination
					rowsPerPageOptions={[10, 25, 50]}
					component="div"
					count={data.length}
					rowsPerPage={rowsPerPage}
					page={page}
					onPageChange={(e, page) => { setPage(page) }}
					onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)) }}
				/>
			</TableContainer>
		</Container>
	);
}

export default DataTable;
